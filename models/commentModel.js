'use strict';
const pool = require('../database/db');
const logger = require('../utils/winston');
const promisePool = pool.promise();

const createComment = async (comment) => {
  try {
    console.log('Comment to be created on commentModel:', comment);
    logger.info(`commentModel.createComment: ${JSON.stringify(comment)}`);
    const [rows] = await promisePool.execute(
        'INSERT INTO comments (comment, postId, userId, vst) VALUES (?, ?, ?, now())', comment);
    logger.info(`createComment : ${JSON.stringify(rows)}`);
    return rows;
  } catch (e) {
    logger.error(`Error on commentModel.createComment function: ${e.message}`);
    console.log('error', e.message);
  }
};

module.exports = {
  createComment,
};