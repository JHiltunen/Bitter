'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getUser = async (id) => {
  try {
    console.log('userModel getUser', id);
    const [rows] = await promisePool.execute('SELECT * FROM users INNER JOIN user_roles ON users.userId = user_roles.userId INNER JOIN roles ON user_roles.roleId = roles.roleId WHERE users.userId = ?', [id]);
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
    await giveUserDefaultRole(row.insertId);
    return row.insertId;
  } catch (e) {
    logger.error(`Error while fetching database: ${e}`);
  }
};

const giveUserDefaultRole = async (id) => {
  try {
    const [row] = await promisePool.execute('INSERT INTO user_roles (roleId, userId) VALUES (2, ?)', [id]);
    return row.insertId;
  } catch (e) {
    logger.error(`Error while fetching database: ${e}`);
  }
}

const updateUser = async (user) => {
  try {
    const [row] = await promisePool.execute('UPDATE users (name, email) VALUES (?, ?)', [user.name, user.username]);
    console.log('insert row', row);
    return row.insertId;
  } catch (e) {
    logger.error(`Error while fetching database: ${e}`);
  }
};

const getUserLogin = async (params) => {
  try {
    console.log(params);
    const [rows] = await promisePool.execute(
        'SELECT users.*, roles.name FROM users INNER JOIN user_roles ON users.userId = user_roles.userId INNER JOIN roles ON user_roles.roleId = roles.roleId WHERE email = ? AND vet IS NULL;',
        params);
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
};
