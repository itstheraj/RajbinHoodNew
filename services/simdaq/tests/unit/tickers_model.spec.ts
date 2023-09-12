import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Ticker from '../../app/Models/Ticker'

test.group('Ticker model tests', group => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('Check if model slugify works', ({ assert }) => {
    let testStr = ' AbC_-'
    assert.equal(Ticker.slugify(testStr), 'abc')
  })
})
