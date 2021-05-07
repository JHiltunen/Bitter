'use strict';
const pool = require('../database/db');
const logger = require('../utils/winston');
const promisePool = pool.promise();

const getAllPosts = async () => {
  try {
    const [rows] = await promisePool.execute(`SELECT posts.postId, posts.title, posts.content, posts.image, posts.userId, posts.vst, users.firstname, users.lastname, COUNT(CASE WHEN liked = 1 THEN 1 END) AS likes, GROUP_CONCAT(CASE WHEN liked=true THEN likes.userId END SEPARATOR ',') AS userLiked, COUNT(CASE WHEN disliked = 1 THEN 1 END) AS dislikes, GROUP_CONCAT(CASE WHEN disliked=true THEN likes.userId END SEPARATOR ',') AS userDisliked FROM posts LEFT JOIN users ON posts.userId = users.userId LEFT JOIN likes ON posts.postId = likes.postId GROUP BY posts.postID ORDER BY posts.vst DESC`);
    return rows;
  } catch (e) {
    console.error('postModel:', e.message);
    logger.error(`Error on postModel.getAllPosts function while fetching database ${e}`);
  }
};

const getFiveMostLikedPosts = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT posts.postId, posts.title, posts.content, posts.image, posts.userId, posts.vst, users.firstname, users.lastname, COUNT(CASE WHEN liked = 1 THEN 1 END) AS likes, GROUP_CONCAT(CASE WHEN liked=true THEN likes.userId END SEPARATOR \',\') AS userLiked, COUNT(CASE WHEN disliked = 1 THEN 1 END) AS dislikes, GROUP_CONCAT(CASE WHEN disliked=true THEN likes.userId END SEPARATOR \',\') AS userDisliked FROM posts LEFT JOIN users ON posts.userId = users.userId LEFT JOIN likes ON posts.postId = likes.postId GROUP BY posts.postID ORDER BY likes DESC LIMIT 5;');
    return rows;
  } catch (e) {
    console.error('postModel:', e.message);
    logger.error(`Error on postModel.getFiveMostLikedPosts function while fetching database ${e}`);
  }
}

const getFivePostsWithMostComments = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT posts.postId, posts.title, posts.content, posts.image, posts.userId, posts.vst, users.firstname, users.lastname, COUNT(CASE WHEN liked = 1 THEN 1 END) AS likes, GROUP_CONCAT(CASE WHEN liked=true THEN likes.userId END SEPARATOR \',\') AS userLiked, COUNT(CASE WHEN disliked = 1 THEN 1 END) AS dislikes, GROUP_CONCAT(CASE WHEN disliked=true THEN likes.userId END SEPARATOR \',\') AS userDisliked, COUNT(comments.postId) AS numberOfComments FROM posts INNER JOIN comments ON comments.postId = posts.postId LEFT JOIN users ON posts.userId = users.userId LEFT JOIN likes ON posts.postId = likes.postId GROUP BY posts.postID ORDER BY numberOfComments DESC LIMIT 5');
    return rows;
  } catch (e) {
    console.error('postModel:', e.message);
    logger.error(`Error on postModel.getFivePostsWithMostComments function while fetching database ${e}`);
  }
}

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
        'INSERT INTO posts (title, content, image, coords, userId, vst) VALUES (?, ?, ?, ?, ?, now())', post);
    logger.info(`createPost : ${JSON.stringify(rows)}`);
    return rows;
  } catch (e) {
    logger.error(`Error on userModel.createPost function: ${e}`);
    console.log('error', e.message);
  }
};

const deletePost = async (post) => {
  try {
    console.log('postModel deletePost', post);
    const [rows] = await promisePool.execute('DELETE FROM posts WHERE postId = ?', post);
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
    const [rows] = await promisePool.execute('INSERT INTO likes (postId, userId, liked, disliked, vst) VALUES (?, ?, 1, 0, now()) ON DUPLICATE KEY UPDATE liked=1, disliked=0, vst=now()', like);
    return rows;
  } catch (e) {
    logger.error(`Error on postModel.addLike function ${e}`);
    console.log('error on addLike: ', e.message);
  }
}

const deleteLike = async (like) => {
  try {
    logger.info(`addLike function like: ${JSON.stringify(like)}`);
    const [rows] = await promisePool.execute('DELETE FROM likes WHERE postId=? AND userId=? AND liked=?', like);
    return rows;
  } catch (e) {
    logger.error(`Error on postModel.addLike function ${e}`);
    console.log('error on addLike: ', e.message);
  }
}

const addDislike = async (dislike) => {
  try {
    // insert dislike
      logger.info(`addDislike function dislike: ${JSON.stringify(dislike)}`);
      const [rows] = await promisePool.execute('INSERT INTO likes (postId, userId, liked, disliked, vst) VALUES (?, ?, 0, 1, now()) ON DUPLICATE KEY UPDATE liked=0, disliked=1, vst=now()', dislike);
      return rows;
  } catch (e) {
    logger.error(`Error on postModel.addDislike function ${e}`);
    console.log('error on addDislike: ', e.message);
  }
}

const deleteDislike = async (dislike) => {
  try {
    logger.info(`deleteDislike function dislike: ${JSON.stringify(dislike)}`);
    const [rows] = await promisePool.execute('DELETE FROM likes WHERE postId=? AND userId=? AND disliked=?', dislike);
    return rows;
  } catch (e) {
    logger.error(`Error on postModel.deleteDislike function ${e}`);
    console.log('error on addLike: ', e.message);
  }
}

module.exports = {
  getAllPosts,
  getFiveMostLikedPosts,
  getFivePostsWithMostComments,
  getComments,
  createPost,
  deletePost,
  updatePost,
  addLike,
  deleteLike,
  addDislike,
  deleteDislike,
};