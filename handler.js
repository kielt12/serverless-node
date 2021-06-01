"use strict";
const connectToDatabase = require("./db");

function HTTPError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports.getCard = async (event) => {
  try {
    
    const { Card } = await connectToDatabase();
    const card = await Card.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(card),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: "Could not create the Card.",
    };
  }
};

module.exports.addCard = async (event) => {
  try {
    const { Card } = await connectToDatabase();
    const response = JSON.parse(event.body);
    if (response.text === undefined) {
      throw new HTTPError(404, "text can not be empty");
    }

    if (response.answer === undefined) {
      throw new HTTPError(404, "answer can not be empty");
    }
    const card = await Card.create(response);
    return {
      statusCode: 200,
      body: JSON.stringify(card),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not create the Card.",
    };
  }
};

module.exports.updateCard = async (event) => {
  try {
    const input = JSON.parse(event.body);
    const { Card } = await connectToDatabase();
    const card = await Card.findByPk(event.pathParameters.id);
    if (!card)
      throw new HTTPError(
        404,
        `Card with id: ${event.pathParameters.id} was not found`
      );
    if (input.text) {
      card.text = input.text;
    }
    if (input.answer) {
      card.answer = input.answer;
    }
    await card.save();
    return {
      statusCode: 200,
      body: JSON.stringify(card),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could not update the Card.",
    };
  }
};

module.exports.destroyCard = async (event) => {
  try {
    const { Card } = await connectToDatabase();
    const card = await Card.findByPk(event.pathParameters.id);
    if (!card) {
      throw new HTTPError(
        404,
        `Card with id: ${event.pathParameters.id} was not found`
      );
    }

    await card.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(card),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { "Content-Type": "text/plain" },
      body: err.message || "Could destroy fetch the Card.",
    };
  }
};
