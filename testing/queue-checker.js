const { exec } = require("child_process");

const cmd = "aws sqs get-queue-attributes --queue-url https://queue.amazonaws.com/824273212766/csv-streaming --attribute-names All";

const run = command => {
  exec(command, (err, stdout, stderr) => {
    const { Attributes } = JSON.parse(stdout);
    console.log(`Queue size: ${Attributes.ApproximateNumberOfMessages}`);
    console.log(Attributes)
  });
}

const main = () => {
  setInterval(() => run(cmd), 2000);
}

main();