// Controller
'use strict';
const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');

const create_post = async (req, res, next) => {
  // Extract the validation errors from a request.

  const errors = validationResult(req); // TODO require validationResult, see userController
  // if errors array isn't empty
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    // create user object to store data
    const post = {};
    post.title = req.body.title;
    post.content = req.body.content;
    post.image = req.body.image;
    post.userId = req.user.userId;
    console.log('post' + JSON.stringify(post));
    logger.info(`post to be created: ${JSON.stringify(post)}`);
    // insert new
    const id = await userModel.createPost(post);
    if (id > 0) {
      next();
    } else {
      logger.error(`Error with creating new post: ${id}`);
      res.status(400).json({error: 'register error'});
    }
  }
};

module.exports = {
  create_post,
};