#!/bin/bash

BUCKET_NAME=csv-streaming
FILE_PATH=testing/file.csv

aws  \
  s3 cp $FILE_PATH s3://$BUCKET_NAME \
  --endpoint-url=http://localhost:4572

# aws  \
#   s3 ls s3://$BUCKET_NAME \
#   --endpoint-url=http://localhost:4572