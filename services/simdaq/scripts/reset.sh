#!/bin/bash
export INGEST_FLOW_ENABLED=false
rm tmp/db.sqlite3
node ace migration:run
node ace db:seed
