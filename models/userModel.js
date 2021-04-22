'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getAllUsers = async () => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner name too.
    const [rows] = await promisePool.execute('SELECT userId, firstname, lastname, email FROM users');
    console.log('something back from db?', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

const getAllUsersSort = async (order) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner name too.
    const [rows] = await promisePool.execute(`SELECT user_id, name, email FROM users ORDER BY ${order}`);
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

const getUser = async (id) => {
  try {
    console.log('userModel getUser', id);
    const [rows] = await promisePool.execute('SELECT * FROM users INNER JOIN user_roles ON users.userId = user_roles.userId INNER JOIN roles ON user_roles.roleId = roles.roleId WHERE users.userId = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('userModel:', e.message);
  }
};

const insertUser = async (user) => {
  const [row] = await promisePool.execute('INSERT INTO users (firstname, lastname, email, dateOfBirth, gender, password, vst) VALUES (?, ?, ?, ?, ?, ?, curdate())', [user.firstname, user.lastname, user.username, user.dateOfBirth, user.gender, user.password]);
  console.log('insert row', row);
  await giveUserDefaultRole(row.insertId);
  return row.insertId;
};

const giveUserDefaultRole = async (id) => {
  const [row] = await promisePool.execute('INSERT INTO user_roles (roleId, userId) VALUES (2, ?)', [id]);
  return row.insertId;
}

const updateUser = async (user) => {
  const [row] = await promisePool.execute('UPDATE users (name, email) VALUES (?, ?)', [user.name, user.username]);
  console.log('insert row', row);
  return row.insertId;
};

const getUserLogin = async (params) => {
  try {
    console.log(params);
    const [rows] = await promisePool.execute(
        'SELECT users.*, roles.name FROM users INNER JOIN user_roles ON users.userId = user_roles.userId INNER JOIN roles ON user_roles.roleId = roles.roleId WHERE email = ? AND vet IS NULL;',
        params);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }
};

module.exports = {
  getAllUsers,
  getAllUsersSort,
  getUser,
  insertUser,
  updateUser,
  getUserLogin,
};
