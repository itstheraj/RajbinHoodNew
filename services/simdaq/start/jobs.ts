if (process.env.INGEST_FLOW_ENABLED === 'true') {
  const updateTickerPriceJob = require('../jobs/UpdateTickerPriceJob')

  ;(async () => {
    await updateTickerPriceJob.default.main()
  })()
}
