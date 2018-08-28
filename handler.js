'use strict';

exports.trackTicket = (event, context) => {
  context.succeed({
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: { success: true }
    }),
  });
};
