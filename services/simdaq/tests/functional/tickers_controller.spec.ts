import { test } from '@japa/runner'
import TestUtils from '@ioc:Adonis/Core/TestUtils'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Ticker controller tests', group => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  group.setup(() => {
    TestUtils.httpServer().start()
  })

  test('Check if index responds', async ({ client }) => {
    const response = await client.get('/tickers/')

    response.assertStatus(200)
  })

  test('Check if metadata responds', async ({ assert, client }) => {
    const response = await client.get('/tickers/metadata')

    response.assertStatus(200)
    assert.isAtLeast(response.body().length, 2)
  })

  test('Check if slug data responds', async ({ assert, client }) => {
    const response = await client.get('/tickers/rajby')

    response.assertStatus(200)
    assert.isAtLeast(response.body().length, 2)
  })
})
