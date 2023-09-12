if (process.env.INGEST_FLOW_ENABLED === 'true') {
  const ingestTickerJob = require('../jobs/IngestTickerJob')

  ;(async () => {
    await ingestTickerJob.default.main()
  })()
}
