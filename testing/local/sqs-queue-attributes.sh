#!/bin/bash

QUEUE_URL=http://localhost:4576/queue/csv-streaming

aws \
  sqs get-queue-attributes \
  --queue-url $QUEUE_URL \
  --attribute-names All \
  --endpoint-url=http://localhost:4576
