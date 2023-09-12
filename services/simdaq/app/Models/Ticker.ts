import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { beforeSave } from '@adonisjs/lucid/build/src/Orm/Decorators'

export default class Ticker extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @column()
  public name: string

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Utility method to slugify asset names
  // for routing in the controller, should be moved
  // but not right now!
  public static slugify(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  @beforeSave()
  public static async slugifyName(ticker: Ticker) {
    if (ticker.$dirty.name) {
      ticker.slug = Ticker.slugify(ticker.$dirty.name)
    }
  }
}
