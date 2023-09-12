import { test } from '@japa/runner'
import TestUtils from '@ioc:Adonis/Core/TestUtils'
import Database from '@ioc:Adonis/Lucid/Database'
import Asset from '../../app/Models/Asset'
import { DateTime } from 'luxon'

test.group('Assets controller tests', group => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  group.setup(() => {
    TestUtils.httpServer().start()
  })

  group.setup(async () => {
    const asset = await Asset.firstOrCreate({
      name: 'testrecord',
      slug: 'testrecord',
    })

    await asset.related('tickers').fetchOrCreateMany([
      {
        price: 1.06,
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
      {
        price: 1.08,
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
    ])
  })

  test('Check if index responds', async ({ client }) => {
    const response = await client.get('/assets/')

    response.assertStatus(200)
  })

  test('Check if historical slug data responds', async ({ assert, client }) => {
    const response = await client.get('/assets/historical/testrecord')

    response.assertStatus(200)
    assert.isAtLeast(response.body().prices.length, 1)
  })

  test('Check if slug names data responds', async ({ assert, client }) => {
    const response = await client.get('/assets/slugs')

    response.assertStatus(200)
    assert.include(response.body(), 'testrecord')
  })
})
