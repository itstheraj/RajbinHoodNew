import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Ticker from 'App/Models/Ticker'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Ticker.createMany([
      {
        name: 'RajCola',
        price: 1.05,
        updatedAt: DateTime.now(),
        createdAt: DateTime.now(),
      },
      {
        name: 'RajVidia',
        price: 2.05,
        updatedAt: DateTime.now(),
        createdAt: DateTime.now(),
      },
      {
        name: 'RajFlix',
        price: 3.05,
        updatedAt: DateTime.now(),
        createdAt: DateTime.now(),
      },
      {
        name: 'MicroRaj',
        price: 40.05,
        updatedAt: DateTime.now(),
        createdAt: DateTime.now(),
      },
      {
        name: 'Rajby',
        price: 50.05,
        updatedAt: DateTime.now(),
        createdAt: DateTime.now(),
      },
    ])
  }
}
