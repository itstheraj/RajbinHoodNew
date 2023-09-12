import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tickers'

  public async up() {
    this.schema.createTable(this.tableName, table => {
      table.increments('id')

      table
        .integer('asset_id')
        .unsigned()
        .references('assets.id')
        .onDelete('CASCADE') // delete tickers when asset is deleted

      table.float('price')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */

      table.timestamp('created_at', { useTz: true }).index()
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
