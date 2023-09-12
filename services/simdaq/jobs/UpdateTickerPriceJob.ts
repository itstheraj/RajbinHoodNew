import Ticker from '../app/Models/Ticker'
import { DateTime } from 'luxon'
export default class UpdateTickerPriceJob {
  public static PRICE_THRESOLD = 0.05

  public static async main() {
    console.log('Starting price generator')
    setInterval(async () => {
      await this.runner()
    }, 1000)
  }

  public static async runner() {
    const uniqueTickerNames = await Ticker.query().distinct('name')

    for (var i = 0; i < uniqueTickerNames.length; i++) {
      var ticker = await Ticker.query()
        .where('name', uniqueTickerNames[i].name)
        .orderBy('created_at', 'desc')
        .first()

      await this.updateTickerPrice(ticker)
    }
  }

  public static async updateTickerPrice(ticker) {
    await Ticker.create({
      name: ticker.name,
      price: this.calculateTickerPrice(ticker.price),
      updatedAt: DateTime.now(),
      createdAt: DateTime.now(),
    })
  }

  public static calculateTickerPrice(ticker_price: number): number {
    const maxChange = UpdateTickerPriceJob.PRICE_THRESOLD * ticker_price
    const minimumValue = ticker_price - maxChange
    const changeValue =
      Math.round(100.0 * Math.random() * (2 * maxChange)) / 100.0
    const newPrice = Math.round(100.0 * (minimumValue + changeValue)) / 100.0

    if (newPrice >= 0.0) {
      return newPrice
    } else {
      return ticker_price
    }
  }
}
