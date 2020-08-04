# csv-streaming

Serverless app to stream an CSV file from S3 bucket to SQS queue.

## Requirements

- Docker and Docker compose needs to be installed to run locally.
- AWS account with aws client working properly.
- Node Serverless framework client installed.

## Setup

Clone repository and install node dependencies.

```bash
git clone git@github.com:augustoscher/csv-streaming.git
cd csv-streaming
npm i
```

## Running

You can run it locally throw docker container or in AWS cloud. Just follow the steps below.

### Locally

#### Setup docker containers

```bash
make run-logs
```

Now you should see localstack resources on [localhost:8080](http://localhost:8080/#!/infra).

#### Setup resources

In another terminal, run:

```bash
make setup
```

Here we're creating S3 bucket and SQS queue on localstack.
Now you should see resources by refreshing localstack page.

And the last thing to do is run app locally. To do that, type:

```bash
make start
```

#### Sending CSV file to local s3 bucket

Now It's time to send csv to our local s3 bucket and see if it's streaming, converting and sending to sqs queue.

Open a new terminal window and run:

```bash
make test-s3
```

Ps: Here we're uploading an csv file to local s3 bucket and manually calling s3listener because localstack triggers is not setup.

Now we'll se if SQS queue receive objetcs, by getting All attributes:

```bash
make test-sqs
```

You should see `get-queue-attributes` output:

```json
{
  "Attributes": {
    "VisibilityTimeout": "30",
    "DelaySeconds": "0",
    "ReceiveMessageWaitTimeSeconds": "0",
    "ApproximateNumberOfMessages": "400",
    "ApproximateNumberOfMessagesNotVisible": "0",
    "ApproximateNumberOfMessagesDelayed": "0",
    "CreatedTimestamp": "1596490739",
    "LastModifiedTimestamp": "1596490739",
    "QueueArn": "arn:aws:sqs:us-east-1:000000000000:csv-streaming"
  }
}
```

### AWS Cloud

Let's deploy and run it on AWS cloud.

#### Deploying

You obviously need to deploy it on AWS. We're using serverless-framework:

```bash
sls deploy
```

All resources (lambdas, bucket and sqs) will be created automatically.

```bash
aws sqs list-queues
aws s3 ls | grep csv-streaming
```

#### Testing

Run each command in diferent terminal:

1. Sending csv file to ou s3 bucket:

```bash
aws s3 cp \
  testing/file.csv \
  s3://csv-streaming
```

2. Run logs on s3 bucket in AWS cloud:

```bash
npx sls logs -f s3listener -t
```

3. Run logs on sqs queue in AWS cloud:

```bash
npx sls logs -f sqslistener -t
```

Optionally: Upload huge csv

```bash
aws s3 cp testing/survey_results_public.csv s3://csv-streaming
```


#### Removing

Final step: Remove all resources, including s3 bucket and sqs queue:

```bash
sls remove
```
