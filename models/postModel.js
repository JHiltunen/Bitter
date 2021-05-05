'use strict';
const pool = require('../database/db');
const logger = require('../utils/winston');
const promisePool = pool.promise();

const getAllPosts = async () => {
  try {
    const [rows] = await promisePool.execute(`SELECT posts.postId, posts.title, posts.content, posts.image, posts.userId, posts.vst, users.firstname, users.lastname, COUNT(likes.postId) AS likes, GROUP_CONCAT(likes.userId SEPARATOR ',') AS liked, COUNT(dislikes.postId) AS dislikes, GROUP_CONCAT(dislikes.userId SEPARATOR ',') AS disliked FROM posts LEFT JOIN users ON posts.userId = users.userId LEFT JOIN likes ON posts.postId = likes.postId LEFT JOIN dislikes ON posts.postId = dislikes.postId GROUP BY posts.postID ORDER BY posts.vst DESC`);
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
}

const updatePost = async (post) => {
  try {
    logger.info(`updatePost post: ${JSON.stringify(post)}`);
    const [rows] = await promisePool.execute(
        'UPDATE posts SET title=?, content=? WHERE postId=? AND userId=?', post);
        logger.info(`updatePost : ${JSON.stringify(rows)}`);
    return rows;
  } catch (e) {
    logger.error(`Error on userModel.updatePost function: ${e}`);
    console.log('error', e.message);
  }
};

const addLike = async (like) => {
  try {
    if (await userLikeOnPostExists(like) == 0) {
      logger.info(`addLike function like: ${JSON.stringify(like)}`);
      const [rows] = await promisePool.execute('INSERT INTO likes (postId, userId, vst) VALUES (?, ?, now())', like)
      return rows;
    } else {
      return 0;
    }
  } catch (e) {
    logger.error(`Error on postModel.addLike function ${e}`);
    console.log('error on addLike: ', e.message);
  }
}

const userLikeOnPostExists = async (like) => {
  try {
    logger.info(`addLike function like: ${JSON.stringify(like)}`);
    const [rows] = await promisePool.execute('SELECT postId, userId FROM likes WHERE postId=? AND userId=?', like)
    return rows;
  } catch (e) {
    logger.error(`Error on postModel.getLikes function ${e}`);
    console.log('error on getLikes: ', e.message);
  }
}

const deleteLike = async (like) => {
  try {
    logger.info(`addLike function like: ${JSON.stringify(like)}`);
    const [rows] = await promisePool.execute('DELETE FROM likes WHERE postId=? AND userId=?', like);
    return rows;
  } catch (e) {
    logger.error(`Error on postModel.addLike function ${e}`);
    console.log('error on addLike: ', e.message);
  }
}

const addDislike = async (dislike) => {
  try {
    // insert dislike
    if (await userDislikeOnPostExists(dislike) == 0) {
      logger.info(`addDislike function dislike: ${JSON.stringify(dislike)}`);
      const [rows] = await promisePool.execute('INSERT INTO dislikes (postId, userId, vst) VALUES (?, ?, now())', dislike)
      return rows;
    } else {
      return 0;
    }
  } catch (e) {
    logger.error(`Error on postModel.addDislike function ${e}`);
    console.log('error on addDislike: ', e.message);
  }
}

const userDislikeOnPostExists = async (dislike) => {
  try {
    logger.info(`userDislikeOnPostExists function dislike: ${JSON.stringify(dislike)}`);
    const [rows] = await promisePool.execute('SELECT postId, userId FROM dislikes WHERE postId=? AND userId=?', dislike)
    return rows;
  } catch (e) {
    logger.error(`Error on postModel.userDislikeOnPostExists function ${e}`);
    console.log('error on userDisLikeOnPostExists: ', e.message);
  }
}

const deleteDislike = async (dislike) => {
  try {
    logger.info(`deleteDislike function dislike: ${JSON.stringify(dislike)}`);
    const [rows] = await promisePool.execute('DELETE FROM dislikes WHERE postId=? AND userId=?', dislike);
    return rows;
  } catch (e) {
    logger.error(`Error on postModel.deleteDislike function ${e}`);
    console.log('error on addLike: ', e.message);
  }
}

module.exports = {
  getAllPosts,
  getComments,
  createPost,
  deletePost,
  updatePost,
  addLike,
  deleteLike,
  userLikeOnPostExists,
  addDislike,
  userDislikeOnPostExists,
  deleteDislike,
};