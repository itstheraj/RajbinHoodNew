import Asset from 'App/Models/Asset'
const superagent = require('superagent')
const pick =
  (...props) =>
  o =>
    props.reduce((a, e) => ({ ...a, [e]: o[e] }), {})

const BASE_URL = process.env.SIMDAQ_API_BASE_URL

export default class IngestTickerJob {
  public static async main() {
    console.log('Bulk import records from SimDaq')
    await this.bulk_sync_runner()
    console.log('Start online ingest from SimDaq')
    setInterval(async () => {
      await this.sync_runner()
    }, 1000)
  }

  public static async bulk_sync_runner() {
    await this.fetchAndCreateAssets()
    await this.backfillTickers()
  }

  public static async fetchAndCreateAssets() {
    try {
      const res = await superagent.get(BASE_URL + 'tickers/metadata')
      if (res.body) {
        await this.createBulkAssets(res.body)
      } else {
        return
      }
    } catch (err) {
      console.error(err)
    }
  }

  public static async backfillTickers() {
    try {
      var slugNames: any = []
      const slugRecords = await Asset.all()
      for (var i = 0; i < slugRecords.length; i++) {
        slugNames.push(slugRecords[i].slug)
      }

      for (var index in slugNames) {
        const res = await superagent.get(
          BASE_URL + 'tickers/' + slugNames[index],
        )
        if (res.statusCode !== 500 && res.body) {
          this.createBulkTicker(slugNames[index], res.body)
        } else {
          return
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  public static async createBulkAssets(assets) {
    Asset.fetchOrCreateMany('name', assets)
  }

  public static async createBulkTicker(slug: string, prices: any) {
    const asset = await Asset.findBy('slug', slug)

    if (!asset) {
      return
    }
    const cleanPrices = prices.map(pick('price', 'created_at', 'updated_at'))
    await asset.related('tickers').fetchOrCreateMany(cleanPrices, 'created_at')
  }

  public static async sync_runner() {
    // query latest ticker value for each slug
    try {
      // index returns all slugs names current tick prices
      const res = await superagent.get(BASE_URL + 'tickers/')
      if (res.statusCode !== 500 && res.body) {
        for (var i = 0; i < res.body.length; i++) {
          var asset = await Asset.findBy('slug', res.body[i].slug)

          if (!asset) {
            continue
          }

          asset.related('tickers').firstOrCreate(
            {
              asset_id: asset.id,
              createdAt: res.body[i].created_at,
            },
            {
              price: res.body[i].price,
              createdAt: res.body[i].created_at,
              updatedAt: res.body[i].updated_at,
            },
          )
        }
      }
    } catch (err) {
      console.error(err)
    }
  }
}
