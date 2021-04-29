// Controller
'use strict';
const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');
const logger = require('../utils/winston');

const create_post = async (req, res, next) => {
  try {
    // Extract the validation errors from a request.
    logger.info('User controller -> Create post function');
    const errors = validationResult(req); // TODO require validationResult, see userController
    logger.info(`User controller -> Create post function -> Erros array: ${JSON.stringify(errors.array)}`);
    // if errors array isn't empty
    if (!errors.isEmpty()) {
      logger.error(`User controller -> Create post function -> There are erros: ${JSON.stringify(errors.array())}`);  
      return res.status(400).json({ errors: errors.array() });
    } else {
      // create user object to store data
      let postFile;
      if (req.file) {
        logger.info(`File selected: ${req.file.filename}`);
        postFile = req.file.filename;
      } else {
        postFile = "No Image";
        logger.info('No file selected');
      }
      const post = [
        req.body.title,
        req.body.content,
        postFile,
        req.user.userId,
      ];
      logger.info(`Post to be created: ${JSON.stringify(post)}`);
      // insert new
      const response = await userModel.createPost(post);
      logger.info(`Create new post response: ${response}`)
      res.json(response);
    }
  } catch (e) {
    console.log('Create_post error', e.message);
  }
};

module.exports = {
  create_post,
};