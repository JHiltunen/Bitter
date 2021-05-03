'use strict';
const pool = require('../database/db');
const logger = require('../utils/winston');
const promisePool = pool.promise();

const getAllPosts = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT posts.postId, posts.title, posts.content, posts.image, posts.likes, posts.dislikes, posts.vst, users.firstname, users.lastname FROM posts LEFT JOIN users ON posts.userId = users.userId ORDER BY vst DESC');
    return rows;
  } catch (e) {
    console.error('postModel:', e.message);
    logger.error(`Error on postModel.getAllPosts function while fetching database ${e}`);
  }
};

const getComments = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT comments.comment, comments.vst, users.firstname, users.lastname FROM comments INNER JOIN users ON users.userId = comments.userId WHERE postId = ?', [id]);
    return rows;
  } catch (e) {
    console.error('postModel.getComments:', e.message);
    logger.error(`Error on postModel.getComments function while fetching database ${e}`);
  }
}

const createPost = async (post) => {
  try {
    console.log('Row 72:', post);
    logger.info(`createPost post: ${JSON.stringify(post)}`);
    const [rows] = await promisePool.execute(
        'INSERT INTO posts (title, content, image, likes, dislikes, userId, vst) VALUES (?, ?, ?, 0, 0, ?, curdate())', post);
    logger.info(`createPost : ${JSON.stringify(rows)}`);
    return rows;
  } catch (e) {
    logger.error(`Error on userModel.createPost function: ${e}`);
    console.log('error', e.message);
  }
};

const deletePost = async (id) => {
  try {
    console.log('postModel deletePost', id);
    const [rows] = await promisePool.execute('DELETE FROM posts WHERE postId = ?', [id]);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('postModel:', e.message);
  }
};

module.exports = {
  getAllPosts,
  getComments,
  createPost,
  deletePost,
};