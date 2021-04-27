'use strict';

const postModel = require('../models/postModel');
const {validationResult} = require('express-validator');

const post_list_get = async (req, res) => {
  const posts = await postModel.getAllPosts();
  res.json(posts);
};
module.exports = {
  post_list_get,
};