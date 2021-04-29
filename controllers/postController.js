'use strict';

const postModel = require('../models/postModel');
const {makeThumbnail} = require('../utils/resize');
const {validationResult} = require('express-validator');

const post_list_get = async (req, res) => {
  const posts = await postModel.getAllPosts();
  res.json(posts);
};

const make_thumbnail = async (req, res, next) => {
  try {
    // image is not mandatory -> handle case where there is no file
    if (req.file == undefined) {
      console.log('PostController row 16');
      next();
    }
    const thumbnail = await makeThumbnail(req.file.path, req.file.filename);
    if (thumbnail) {
      console.log('PostController row 21');
      next();
    }
  } catch (e) {
    res.status(400).json({error: e.message});
  }
};

module.exports = {
  post_list_get,
  make_thumbnail,
};