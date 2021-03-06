'use strict';

const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');
const {makeThumbnail} = require('../utils/resize');
const {validationResult} = require('express-validator');
const logger = require('../utils/winston');
const imageMeta = require('../utils/imageMeta');

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
        let coords;
        if (req.file) {
          logger.info(`File selected: ${req.file.filename}`);
          postFile = req.file.filename;
          coords = await imageMeta.getCoordinates(req.file.path);
        } else {
          postFile = "No Image";
          coords = 'No Coords';
          logger.info('No file selected');
        }

        if (!coords) {
          coords = 'No Coords';
        }
        
        // create post object to store data
        const post = [
          req.body.title,
          req.body.content,
          postFile,
          coords,
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
          req.params.id,
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

const delete_like = async (req, res, next) => {
  console.log('User on delete_like:', req.user);
  if (req.user !== undefined) {
    try {
      // Extract the validation errors from a request.
      logger.info('Forum controller -> delete_like function');
      const errors = validationResult(req);
      logger.info(`Forum controller -> delete_like function -> Erros array: ${JSON.stringify(errors.array)}`);
      // if errors array isn't empty
      if (!errors.isEmpty()) {
        logger.error(`Forum controller -> delete_like function -> There are erros: ${JSON.stringify(errors.array())}`);  
        return res.status(400).json({ errors: errors.array() });
      } else {
        logger.info('req: ', req);
        // create post object to store data
        const like = [
          req.body.postId,
          req.user.userId,
          true,
        ];
        logger.info(`Like to be deleted: ${JSON.stringify(like)}`);
        // delete likes
        const response = await postModel.deleteLike(like);
        logger.info(`Like delete response: ${JSON.stringify(response)}`);
        res.json(response);
      }
    } catch (e) {
      console.log('delete_like error: ', e.message);
    }
  }
};

const insert_like = async (req, res, next) => {
  console.log('User on insert_like:', req.user);
  if (req.user !== undefined) {
    try {
      // Extract the validation errors from a request.
      logger.info('Forum controller -> insert_like function');
      const errors = validationResult(req);
      logger.info(`Forum controller -> insert_like function -> Erros array: ${JSON.stringify(errors.array)}`);
      // if errors array isn't empty
      if (!errors.isEmpty()) {
        logger.error(`Forum controller -> insert_like function -> There are erros: ${JSON.stringify(errors.array())}`);  
        return res.status(400).json({ errors: errors.array() });
      } else {
        logger.info('req: ', req)
        // create like object that will be inserted
        const like = [
          req.body.postId,
          req.user.userId,
        ];
        logger.info(`Like to be inserted: ${JSON.stringify(like)}`);
        // update likes
        const response = await postModel.addLike(like);
        logger.info(`Like insert response: ${JSON.stringify(response)}`);
        res.json(response);
      }
    } catch (e) {
      console.log('insert_like error: ', e.message);
    }
  }
};

const insert_dislike = async (req, res, next) => {
  console.log('User on insert_dislike:', req.user);
  if (req.user !== undefined) {
    try {
      // Extract the validation errors from a request.
      logger.info('Forum controller -> insert_dislike function');
      const errors = validationResult(req);
      logger.info(`Forum controller -> insert_dislike function -> Erros array: ${JSON.stringify(errors.array)}`);
      // if errors array isn't empty
      if (!errors.isEmpty()) {
        logger.error(`Forum controller -> insert_dislike function -> There are erros: ${JSON.stringify(errors.array())}`);  
        return res.status(400).json({ errors: errors.array() });
      } else {
        logger.info('req: ', req)
        // create dislike object that will be inserted
        const dislike = [
          req.body.postId,
          req.user.userId,
        ];
        // update dislikes
        const response = await postModel.addDislike(dislike);
        logger.info(`Dislike insert response: ${JSON.stringify(response)}`);
        res.json(response);
      }
    } catch (e) {
      console.log('insert_dislike error: ', e.message);
    }
  }
};

const delete_dislike = async (req, res, next) => {
  console.log('User on delete_dislike:', req.user);
  if (req.user !== undefined) {
    try {
      // Extract the validation errors from a request.
      logger.info('Forum controller -> delete_dislike function');
      const errors = validationResult(req);
      logger.info(`Forum controller -> delete_dislike function -> Erros array: ${JSON.stringify(errors.array)}`);
      // if errors array isn't empty
      if (!errors.isEmpty()) {
        logger.error(`Forum controller -> delete_dislike function -> There are erros: ${JSON.stringify(errors.array())}`);  
        return res.status(400).json({ errors: errors.array() });
      } else {
        logger.info('req: ', req)
        // create post object to store data
        const dislike = [
          req.body.postId,
          req.user.userId,
          true,
        ];
        logger.info(`Dislike to be deleted: ${JSON.stringify(dislike)}`);
        // delete dislike
        const response = await postModel.deleteDislike(dislike);
        logger.info(`Dislike delete response: ${JSON.stringify(response)}`);
        res.json(response);
      }
    } catch (e) {
      console.log('delete_like error: ', e.message);
    }
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
  }
};

const post_delete = async (req, res) => {
  logger.info(`User on post_delete at forumController: ${JSON.stringify(req.user)}`)
  logger.info(`Body on post_delete at forumController: ${JSON.stringify(req.body)}`)
  console.log('User on post_delete:', req.body);
  if (req.user !== undefined) {
    try {
      // post to store data
      const post = [
        req.params.id
      ];
      // delete
      const response = await postModel.deletePost(post);
      logger.info(`Post_delete response: ${JSON.stringify(response)}`)
      res.json(response);
    } catch (e) {
      console.log('post_delete error', e.message);
      logger.error(`post_delete error: ${e.message}`);
    }
  }
};

module.exports = {
  make_thumbnail,
  create_post,
  edit_post,
  create_comment,
  post_delete,
  insert_like,
  delete_like,
  insert_dislike,
  delete_dislike,
};