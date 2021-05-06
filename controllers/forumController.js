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

const get_five_most_liked_posts = async (req, res) => {
  const mostLikedPosts = await postModel.getFiveMostLikedPosts();
  res.json(mostLikedPosts);
}

const get_five_most_commented_posts = async (req, res) => {
  const mostCommentedPosts = await postModel.getFivePostsWithMostComments();
  res.json(mostCommentedPosts);
}

module.exports = {
  post_list_get,
  comment_list_get,
  get_five_most_liked_posts,
  get_five_most_commented_posts,
};