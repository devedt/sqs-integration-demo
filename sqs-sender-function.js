/*
* Sample sqs sender lambda function
*
*/

const AWS = require("aws-sdk");

AWS.config.update({ region: "ap-southeast-1" });

const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

exports.handler = async (event) => {
  console.info(`Sending messages to queue.`);

  let response = await sendSqsBatch();
  console.info(`Message sent: ${response}`);
  console.info(`Execution complete.`);

  return respond(200, 'done');
};

async function sendSqsBatch() {
  let batchParam = {
    Entries: [
    {
      Id: 'msg1',
      MessageBody: 'Sample message 1'
    },
    {
      Id: 'msg2',
      MessageBody: 'Sample message 2'
    },
    {
      Id: 'msg3',
      MessageBody: 'Sample message 3'
    }
    ],
    QueueUrl: 'https://sqs.ap-southeast-1.amazonaws.com/1234567890/rnd-queue'
  };

  return sqs.sendMessageBatch(batchParam).promise();
}

function respond(status, message) {
  const response = {
    statusCode: status,
    body: JSON.stringify(message),
  };

  return response;
}
