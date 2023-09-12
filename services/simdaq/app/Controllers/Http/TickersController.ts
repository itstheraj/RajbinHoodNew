// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Ticker from 'App/Models/Ticker'

export default class TickersController {
  public async index({ response }) {
    const tickerNames = await Ticker.query().distinct('name')

    var tickers: any = []
    for (var i = 0; i < tickerNames.length; i++) {
      var ticker = await Ticker.query()
        .where('name', tickerNames[i].name)
        .orderBy('created_at', 'desc')
        .first()

      tickers.push(ticker)
    }

    if (tickers.length < 1) {
      return response.notFound({ message: 'No tickers!' })
    }

    return response.ok(tickers)
  }

  public async metadata({ response }) {
    const tickerNames = await Ticker.query().select('name', 'slug').distinct()

    var returnFormat: any = []
    for (var i = 0; i < tickerNames.length; i++) {
      returnFormat.push({
        name: tickerNames[i].name,
        slug: tickerNames[i].slug,
      })
    }

    if (tickerNames.length < 1) {
      return response.notFound({ message: 'No tickers!' })
    }

    return response.ok(returnFormat)
  }

  public async show({ params, response }) {
    const { slug }: { slug: string } = params

    const ticker: any = await Ticker.query()
      .where('slug', 'like', slug)
      .orderBy('created_at', 'desc')

    if (!ticker || ticker.length < 1) {
      return response.notFound({ message: 'Ticker not found' })
    }

    return response.ok(ticker)
  }
}
