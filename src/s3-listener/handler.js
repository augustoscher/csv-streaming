const { getSdks } = require('./connections');
const { Writable, pipeline } = require('stream');
const csvtojson = require('csvtojson');

// Quando um arquivo csv é adicionado no bucket, está lambda será disparada automaticamente.
// Utilizamos streams para converter o arquivo para JSON e item a item adicioná-lo na fila do SQS.

class Handler {
  constructor({ s3Svc, sqsSvc }) {
    this.s3Svc = s3Svc;
    this.sqsSvc = sqsSvc;
    this.queueName = process.env.SQS_QUEUE;
  }

  async getQueueUrl() {
    const { QueueUrl } = await this.sqsSvc
      .getQueueUrl({
        QueueName: this.queueName,
      })
      .promise();
    return QueueUrl;
  }

  getParamsFromEvent(event) {
    const [
      {
        s3: {
          bucket: { name },
          object: { key },
        },
      },
    ] = event.Records;
    return { name, key };
  }

  processDataOnDemand(queueUrl, processedItems) {
    const writableStream = new Writable({
      write: (chunk, encoding, done) => {
        const item = chunk.toString();
        console.log("sending to sqs: ", item, "at ", new Date().toISOString());

        this.sqsSvc.sendMessage(
          {
            QueueUrl: queueUrl,
            MessageBody: item,
          },
          done
        );

        processedItems.count += 1;
      },
    });
    return writableStream;
  }

  async pipefyStreams(...args) {
    return new Promise((resolve, reject) => {
      //args são as n functions
      pipeline(...args, (error) => (error ? reject(error) : resolve()));
    });
  }

  async main(event) {
    const { name, key } = this.getParamsFromEvent(event);
    console.log("processing s3 listener: ", name, key);

    try {
      const queueUrl = await this.getQueueUrl();

      const processedItems = { count: 0 }
      //desta forma, o processo que ocasionar o erro primeiro, ja para a execução
      //e não precisa pegar o onfinish, onclose para retornar o handler
      await this.pipefyStreams(
        this.s3Svc.getObject({ Bucket: name, Key: key }).createReadStream(),
        csvtojson(),
        this.processDataOnDemand(queueUrl, processedItems)
      );

      console.log("process s3 listener finished...", new Date().toISOString());

      return {
        statusCode: 200,
        body: `Done. ${processedItems.count} items sended to SQS.`,
      };
    } catch (e) {
      console.log("Error: ", e.stack);
      return {
        statusCode: 500,
        body: "Internal Error",
      };
    }
  }
}

const { s3, sqs } = getSdks();

const handler = new Handler({
  sqsSvc: sqs,
  s3Svc: s3
});

module.exports = handler.main.bind(handler);
