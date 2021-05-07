'use strict';

const pool = require('../database/db');
const logger = require('../utils/winston');
const promisePool = pool.promise();
// get all users
const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT users.userId, firstname, lastname, email, roles.name, gender, dateOfBirth FROM users INNER JOIN user_roles ON users.userId = user_roles.userId INNER JOIN roles ON user_roles.roleId = roles.roleId');
    console.log('something back from db?', rows);
    logger.info(`Get all users from database: ${JSON.stringify(rows)}`);
    return rows;
  } catch (e) {
    logger.error(`Error on adminModel.getAllUsers function while fetching database: ${e}`);
    console.error('error', e.message);
  }
};

// get all users in sorted list
const getAllUsersSort = async (order) => {
  try {
    const [rows] = await promisePool.execute(`SELECT users.userId, firstname, lastname, email, roles.name FROM users INNER JOIN user_roles ON users.userId = user_roles.userId INNER JOIN roles ON user_roles.roleId = roles.roleId ORDER BY ${order}`);
    logger.info(`Get all users from database: ${JSON.stringify(rows)}`);
    return rows;
  } catch (e) {
    logger.error(`Error on adminModel.GetAllUsersSort function while fetching database: ${e}`);
    console.error('error', e.message);
  }
};

const updateUser = async (user) => {
  try {
    const [rows] = await promisePool.execute(`UPDATE users SET firstname=?, lastname=?, email=?, dateOfBirth=?, gender=? WHERE users.userId=?`, user);
    logger.info(`Update user on database: ${JSON.stringify(rows)}`);
    return rows;
  } catch (e) {
    logger.error(`Error on adminModel.updateUser function while fetching database: ${e}`);
    console.error('error', e.message);
  }
};

const deleteUser = async (user) => {
  try {
    const [rows] = await promisePool.execute(`DELETE FROM users WHERE users.userId=?`, user);
    logger.info(`Delete user on database: ${JSON.stringify(rows)}`);
    return rows;
  } catch (e) {
    logger.error(`Error on adminModel.deleteUser function while fetching database: ${e}`);
    console.error('error', e.message);
  }
};

module.exports = {
  getAllUsers,
  getAllUsersSort,
  updateUser,
  deleteUser,
};
