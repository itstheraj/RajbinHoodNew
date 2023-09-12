// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Asset from 'App/Models/Asset'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AssetsController {
  public async index({ response }) {
    const assetNames = await Asset.all()

    let output: any = []
    let latestAssetPrice
    for (let i = 0; i < assetNames.length; i++) {
      latestAssetPrice = await assetNames[i]
        .related('tickers')
        .query()
        .orderBy('created_at', 'desc')
        .first()

      if (latestAssetPrice) {
        latestAssetPrice = latestAssetPrice.price
      } else {
        continue
      }

      output.push({
        name: assetNames[i].name,
        slug: assetNames[i].slug,
        current_price: latestAssetPrice,
      })
    }

    if (output.length < 1) {
      return response.notFound({ message: 'No tickers!' })
    }

    return response.ok(output)
  }

  public async slugs({ response }) {
    const tickerSlugs = await Asset.query().distinct('slug')

    let tickers: any = []
    for (let i = 0; i < tickerSlugs.length; i++) {
      tickers.push(tickerSlugs[i].slug)
    }

    if (tickers.length < 1) {
      return response.notFound({ message: 'No tickers!' })
    }

    return response.ok(tickers)
  }

  public async historical_by_slug({ params, response }) {
    const { slug }: { slug: string } = params

    const asset = await Asset.findBy('slug', slug)
    if (!asset) {
      return response.notFound({ message: 'Ticker not found' })
    }

    const data = await Database.from('assets')
      .join('tickers', 'assets.id', '=', 'tickers.asset_id')
      .select(
        'assets.name',
        'assets.slug',
        'tickers.price',
        'tickers.created_at',
      )
      .where('assets.slug', slug)
      .orderBy('tickers.created_at', 'asc')

    const outputData = {
      slug: slug,
      prices: data.map(row => {
        return row.price
      }),
      timestamps: data.map(row => {
        return row.created_at
      }),
    }

    if (!outputData || outputData.prices.length < 1) {
      return response.notFound({ message: 'Ticker not found' })
    }

    return response.ok(outputData)
  }
}
