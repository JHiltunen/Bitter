'use strict';

const pool = require('../database/db');
const logger = require('../utils/winston');
const promisePool = pool.promise();
// get all users
const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT users.userId, firstname, lastname, email, roles.name FROM users INNER JOIN user_roles ON users.userId = user_roles.userId INNER JOIN roles ON user_roles.roleId = roles.roleId');
    console.log('something back from db?', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

// get all users in sorted list
const getAllUsersSort = async (order) => {
  try {
    const [rows] = await promisePool.execute(`SELECT users.userId, firstname, lastname, email, roles.name FROM users INNER JOIN user_roles ON users.userId = user_roles.userId INNER JOIN roles ON user_roles.roleId = roles.roleId ORDER BY ${order}`);
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

module.exports = {
  getAllUsers,
  getAllUsersSort,
};
