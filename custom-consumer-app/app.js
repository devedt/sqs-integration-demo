/*
* A sample sqs consumer application using sqs-consumer library.
*
*/

const { Consumer } = require("sqs-consumer");
const AWS = require("aws-sdk");

const QUEUE_URL = "https://sqs.ap-southeast-1.amazonaws.com/1234567890/rnd-queue";
const REGION = "ap-southeast-1";
const SQS_BATCH_SIZE = 2;

AWS.config.update({
  region: REGION,
  accessKeyId: "YOUR ACCCESS KEY ID",
  secretAccessKey: "YOUR SECRET ACCCESS KEY",
});

function getDatetime() {
  return "[" + new Date().toUTCString() + "] ";
}

function log(logMessage) {
  console.info(`${getDatetime()} ${logMessage}`);
}

const app = Consumer.create({
  queueUrl: QUEUE_URL,
  batchSize: SQS_BATCH_SIZE,
  handleMessageBatch: async (batch) => {
    log(`Message recieved: ${batch.length}`);
    let messages = batch.map(function (msg) {
      return {
        MessageId: msg.MessageId,
        Text: msg.Body,
      };
    });

    log(`Extracted messages: ${JSON.stringify(messages)}`);

    for (let i = 0; i < messages.length; i++) {
      log(`Processing message: ${JSON.stringify(messages[i])}`);

      if (i == 1) {
        throw new Error(`Error occured on message: ${JSON.stringify(messages[i])}`);
      }
    }
  },
  sqs: new AWS.SQS(),
});

app.on("error", (err) => {
  log(`error! ${err.message}`);
});

app.on("processing_error", (err) => {
  log(`processing_error! ${err.message}`);
});

app.on("timeout_error", (err) => {
  log(`timeout_error! ${err.message}`);
});

app.on("message_processed", (message) => {
  log(`Message processed: ${message.MessageId}`);
});

app.on("empty", () => {
  log(`SQS queue empty.`);
});

app.on("stopped", () => {
  log(`SQS Polling stopped. Exiting application..`);
});

app.start();
