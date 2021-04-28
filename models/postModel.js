'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllPosts = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT postId, title, content, image, likes, dislikes, users.firstname, users.lastname FROM posts INNER JOIN users ON posts.userId = users.userId');
    return rows;
  } catch (e) {
    console.error('postModel:', e.message);
  }
};
module.exports = {
  getAllPosts,
};