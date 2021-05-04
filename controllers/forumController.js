'use strict';

const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');
const {makeThumbnail} = require('../utils/resize');
const {validationResult} = require('express-validator');
const logger = require('../utils/winston');

const post_list_get = async (req, res) => {
  const posts = await postModel.getAllPosts();
  res.json(posts);
};

const comment_list_get = async (req, res) => {
  const comments = await postModel.getComments(req.params.id);
  res.json(comments);
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
      logger.info('Forum controller -> Create post function');
      const errors = validationResult(req);
      logger.info(`Forum controller -> Create post function -> Erros array: ${JSON.stringify(errors.array)}`);
      // if errors array isn't empty
      if (!errors.isEmpty()) {
        logger.error(`Forum controller -> Create post function -> There are erros: ${JSON.stringify(errors.array())}`);  
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
        logger.info(`Create new post response: ${JSON.stringify(response)}`);
        res.json(response);
      }
    } catch (e) {
      console.log('Create_post error', e.message);
    }
  } else {
    res.status(401).send('You are not logged in!');
  }
};

const edit_post = async (req, res, next) => {
  console.log('User on edit_post:', req.user);
  if (req.user !== undefined) {
    try {
      // Extract the validation errors from a request.
      logger.info('Forum controller -> Edit post function');
      const errors = validationResult(req);
      logger.info(`Forum controller -> Edit post function -> Erros array: ${JSON.stringify(errors.array)}`);
      // if errors array isn't empty
      if (!errors.isEmpty()) {
        logger.error(`Forum controller -> Edit post function -> There are erros: ${JSON.stringify(errors.array())}`);  
        return res.status(400).json({ errors: errors.array() });
      } else {
        logger.info('req: ', req)
        // create post object to store data
        const post = [
          req.body.title,
          req.body.content,
          req.body.postId,
          req.user.userId,
        ];
        logger.info(`Edit to be created: ${JSON.stringify(post)}`);
        // update post
        const response = await postModel.updatePost(post);
        logger.info(`Edit post response: ${JSON.stringify(response)}`);
        res.json(response);
      }
    } catch (e) {
      console.log('Edit_post error', e.message);
    }
  } else {
    res.status(401).send('You are not logged in!');
  }
};

const create_comment = async (req, res, next) => {
  logger.info(`User on create_comment at forumController: ${JSON.stringify(req.user)}`)
  logger.info(`Body on create_comment at forumController: ${JSON.stringify(req.body)}`)
  console.log('User on create_comment:', req.body);
  if (req.user !== undefined) {
    try {
      console.log('Param: ', req.body.comment);
      // Extract the validation errors from a request.
      logger.info('Forum controller -> Create comment function');
      const errors = validationResult(req);
      logger.info(`Forum controller -> Create comment function -> Erros array: ${JSON.stringify(errors.array)}`);
      // if errors array isn't empty
      if (!errors.isEmpty()) {
        logger.error(`Forum controller -> Create comment function -> There are erros: ${JSON.stringify(errors.array())}`);  
        return res.status(400).json({ errors: errors.array() });
      } else {
        console.log('Body:: ', req.body);
        // create comment object to store data
        const comment = [
          req.body.comment,
          req.body.postId,
          req.user.userId
        ];
        logger.info(`Comment to be created: ${JSON.stringify(comment)}`);
        // insert new
        const response = await commentModel.createComment(comment);
        logger.info(`Create new comment response: ${JSON.stringify(response)}`)
        res.json(response);
      }
    } catch (e) {
      console.log('Create_comment error', e.message);
      logger.error(`Create_comment error: ${e.message}`);
    }
  } else {
    res.status(401).send('You are not logged in!');
  }
};

module.exports = {
  post_list_get,
  comment_list_get,
  make_thumbnail,
  create_post,
  edit_post,
  create_comment,
};