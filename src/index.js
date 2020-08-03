const s3listener = require('./s3-listener/handler');
const sqslistener = require('./sqs-listener/handler');

module.exports = {
  s3listener,
  sqslistener
}
