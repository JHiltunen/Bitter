// Controller
'use strict';
const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');
const logger = require('../utils/winston');

const create_post = async (req, res, next) => {
  // Extract the validation errors from a request.

  const errors = validationResult(req); // TODO require validationResult, see userController
  // if errors array isn't empty
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    // create user object to store data
    const post = [
      req.body.title,
      req.body.content,
      req.file.filename,
      req.user.userId,
    ];
    // insert new
    const response = await userModel.createPost(post);
    res.json(response);
  }
};

module.exports = {
  create_post,
};