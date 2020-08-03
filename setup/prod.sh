#!/bin/bash

BUCKET_NAME=$1
QUEUE_NAME=$2
FILE_PATH=$3

echo "1. deploying..."
sls deploy

echo "2. creating bucket..."
aws  \
  s3 mb s3://$BUCKET_NAME \
  # --endpoint-url=http://localhost:4572

echo "3. creating queue..."

aws \
  sqs create-queue \
  --queue-name $QUEUE_NAME \
  # --endpoint-url=http://localhost:4576

aws \
  sqs list-queues \
  # --endpoint-url=http://localhost:4576

echo "4. deploying csv..."
aws  \
  s3 cp $FILE_PATH s3://$BUCKET_NAME \

aws  \
  s3 ls $BUCKET_NAME \
  # --endpoint-url=http://localhost:4572