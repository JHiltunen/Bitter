'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getAllUsers = async () => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner name too.
    const [rows] = await promisePool.execute('SELECT user_id, name, email FROM users');
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
    const [rows] = await promisePool.execute('SELECT * FROM users WHERE user_id = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('userModel:', e.message);
  }
};

const insertUser = async (user) => {
  const [row] = await promisePool.execute('INSERT INTO users (firstname, lastname, email, dateOfBirth, gender, password) VALUES (?, ?, ?, ?, ?, ?)', [user.firstname, user.lastname, user.username, user.dateOfBirth, user.gender, user.password]);
  console.log('insert row', row);
  return row.insertId;
};

const updateUser = async (user) => {
  const [row] = await promisePool.execute('UPDATE users (name, email) VALUES (?, ?)', [user.name, user.username]);
  console.log('insert row', row);
  return row.insertId;
};

const getUserLogin = async (params) => {
  try {
    console.log(params);
    const [rows] = await promisePool.execute(
        'SELECT * FROM users WHERE email = ?;',
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
