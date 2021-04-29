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

module.exports = {
  post_list_get,
  make_thumbnail,
};