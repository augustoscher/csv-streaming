const AWS = require('aws-sdk');

const getSdks = () => {
  const host = process.env.LOCALSTACK_HOST || "localhost";
  const s3Port = process.env.S3_PORT || "4572";
  const sqsPort = process.env.SQS_PORT || "4576";
  const isLocal = process.env.IS_LOCAL;
  const s3Endpoint = new AWS.Endpoint(`http://${host}:${s3Port}`);
  const sqsEndpoint = new AWS.Endpoint(`http://${host}:${sqsPort}`);

  const s3Config = {
    endpoint: s3Endpoint,
    s3ForcePathStyle: true,
  };

  const sqsConfig = {
    endpoint: sqsEndpoint,
  };

  if (!isLocal) {
    delete s3Config.endpoint;
    delete sqsConfig.endpoint;
  }

  return {
    s3: new AWS.S3(s3Config),
    sqs: new AWS.SQS(sqsConfig),
  };
}

module.exports = { getSdks }
