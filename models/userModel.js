'use strict';

const pool = require('../database/db');
const logger = require('../utils/winston');
const promisePool = pool.promise();

const getUser = async (id) => {
  try {
    console.log('userModel getUser', id);
    logger.info(`userModel getUser with id: ${userModel}`);
    const [rows] = await promisePool.execute('SELECT * FROM users INNER JOIN user_roles ON users.userId = user_roles.userId INNER JOIN roles ON user_roles.roleId = roles.roleId WHERE users.userId = ?', [id]);
    logger.info(`Data fetched from database: ${JSON.stringify(rows)}`);
    return rows[0];
  } catch (e) {
    logger.error(`Error while fetching database: ${e}`);
    console.error('userModel:', e.message);
  }
};

const insertUser = async (user) => {
  try {
    const [row] = await promisePool.execute('INSERT INTO users (firstname, lastname, email, dateOfBirth, gender, password, vst) VALUES (?, ?, ?, ?, ?, ?, curdate())', [user.firstname, user.lastname, user.username, user.dateOfBirth, user.gender, user.password]);
    console.log('insert row', row);
    logger.info(`Insert row on insertUser: ${JSON.stringify(row)}`);
    await giveUserDefaultRole(row.insertId);
    logger.info(`Inserted default role`);
    return row.insertId;
  } catch (e) {
    logger.error(`Error while fetching database: ${e}`);
  }
};

const giveUserDefaultRole = async (id) => {
  try {
    logger.info(`giveUserDefaultRole with id: ${id}`);
    const [row] = await promisePool.execute('INSERT INTO user_roles (roleId, userId) VALUES (2, ?)', [id]);
    logger.info(`Data fetched from database: ${JSON.stringify(rows)}`);
    return row.insertId;
  } catch (e) {
    logger.error(`Error while fetching database: ${e}`);
  }
}

const updateUser = async (user) => {
  try {
    const [row] = await promisePool.execute('UPDATE users (name, email) VALUES (?, ?)', [user.name, user.username]);
    console.log('insert row', row);
    logger.info(`Update row on updateUser: ${JSON.stringify(row)}`);
    return row.insertId;
  } catch (e) {
    logger.error(`Error while fetching database: ${e}`);
  }
};

const getUserLogin = async (params) => {
  try {
    console.log(params);
    logger.info(`getuserLogin params: ${JSON.stringify(params)}`);
    const [rows] = await promisePool.execute(
        'SELECT users.*, roles.name FROM users INNER JOIN user_roles ON users.userId = user_roles.userId INNER JOIN roles ON user_roles.roleId = roles.roleId WHERE email = ? AND vet IS NULL;',
        params);
    logger.info(`GetUserLogin : ${JSON.stringify(rows)}`);
    return rows;
  } catch (e) {
    logger.error(`Error while fetching database: ${e}`);
    console.log('error', e.message);
  }
};

const createPost = async (post) => {
  try {
    console.log(post);
    logger.info(`createPost post: ${JSON.stringify(post)}`);
    const [rows] = await promisePool.execute(
        'INSERT INTO posts (title, content, image, likes, dislikes, userId, vst) VALUES (?, ?, ?, 0, 0, 1, curdate())', [post.title, post.content, post.image]);
    logger.info(`createPost : ${JSON.stringify(rows)}`);
    return rows;
  } catch (e) {
    logger.error(`Error while fetching database: ${e}`);
    console.log('error', e.message);
  }
};

module.exports = {
  getUser,
  insertUser,
  updateUser,
  getUserLogin,
  createPost,
};
