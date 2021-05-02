'use strict';

const postModel = require('../models/postModel');
const {makeThumbnail} = require('../utils/resize');
const {validationResult} = require('express-validator');
const logger = require('../utils/winston');

const post_list_get = async (req, res) => {
  const posts = await postModel.getAllPosts();
  res.json(posts);
};

const make_thumbnail = async (req, res, next) => {
  try {
    // image is not mandatory -> handle case where there is no file
    if (req.file == undefined) {
      logger.info('no image selected -> no resize required');
      next();
      return;
    }

    logger.info('Creating thumbnail...');
    const thumbnail = await makeThumbnail(req.file.path, req.file.filename);
    if (thumbnail) {
      logger.info('Succesfully created thumbnail');
      next();
    }
  } catch (e) {
    logger.error(`Error: Status 400 -> ${e}`)
    res.status(400).json({error: e.message});
  }
};

const create_post = async (req, res, next) => {
  console.log('User on create_post:', req.user);
  if (req.user !== undefined) {
    try {
      // Extract the validation errors from a request.
      logger.info('Post controller -> Create post function');
      const errors = validationResult(req);
      logger.info(`Post controller -> Create post function -> Erros array: ${JSON.stringify(errors.array)}`);
      // if errors array isn't empty
      if (!errors.isEmpty()) {
        logger.error(`Post controller -> Create post function -> There are erros: ${JSON.stringify(errors.array())}`);  
        return res.status(400).json({ errors: errors.array() });
      } else {
        // check if there is file attached
        let postFile;
        if (req.file) {
          logger.info(`File selected: ${req.file.filename}`);
          postFile = req.file.filename;
        } else {
          postFile = "No Image";
          logger.info('No file selected');
        }
        // create post object to store data
        const post = [
          req.body.title,
          req.body.content,
          postFile,
          req.user.userId,
        ];
        logger.info(`Post to be created: ${JSON.stringify(post)}`);
        // insert new
        const response = await postModel.createPost(post);
        //logger.info(`Create new post response: ${response}`)
        res.json(response);
      }
    } catch (e) {
      console.log('Create_post error', e.message);
    }
  } else {
    res.status(401).send('You are not logged in!');
  }
};

module.exports = {
  post_list_get,
  make_thumbnail,
  create_post,
};