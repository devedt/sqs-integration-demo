/**
* Sample sqs consumer lambda function
*
*/

exports.handler = async (event) => {
  console.info(`Message received: ${JSON.stringify(event.Records.length)}`);

  let messages = event.Records.map(function (record) {
    return {
      MessageId: record.messageId,
      Text: record.body,
    };
  });

  console.info(`Extracted messages: ${JSON.stringify(messages)}`);

  for (let i = 0; i < messages.length; i++) {
    console.info(`Processing message: ${JSON.stringify(messages[i])}`);

    if (i == 1) {
      throw new Error(`Error occured on message: ${JSON.stringify(messages[i])}`);
    }
  }

  console.info(`Execution complete.`);

  return respond(200, "done");
};

function respond(status, message) {
  const response = {
    statusCode: status,
    body: JSON.stringify(message),
  };

  return response;
}
