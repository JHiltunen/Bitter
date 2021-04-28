// Controller
'use strict';
const contactModel = require('../models/contactModel');
const {validationResult} = require('express-validator');
const logger = require('../utils/winston');

const insertContact = async (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req); // TODO require validationResult, see userController
  // if errors array isn't empty
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    // create contact object to store data
    const contact = [
      req.body.name,
      req.body.email,
      req.body.message
    ];
    logger.info(`contact data to be inserted: ${JSON.stringify(contact)}`);
    // insert new
    const response = await contactModel.insertContact(contact);
    res.json(response);
  }
};

module.exports = {
  insertContact,
};