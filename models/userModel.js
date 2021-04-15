'use strict';

const pool = require('../database/db');
const promisePool = pool.promise();

const getAllUsers = async () => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner name too.
    const [rows] = await promisePool.execute('SELECT user_id, name, email FROM wop_user');
    console.log('something back from db?', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

const getAllUsersSort = async (order) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner name too.
    const [rows] = await promisePool.execute(`SELECT user_id, name, email FROM wop_user ORDER BY ${order}`);
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

const getUser = async (id) => {
  try {
    console.log('userModel getUser', id);
    const [rows] = await promisePool.execute('SELECT * FROM wop_user WHERE user_id = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('userModel:', e.message);
  }
};

const insertUser = async (user) => {
  const [row] = await promisePool.execute('INSERT INTO wop_user (name, email, password) VALUES (?, ?, ?)', [user.name, user.username, user.password]);
  console.log('insert row', row);
  return row.insertId;
};

const updateUser = async (user) => {
  const [row] = await promisePool.execute('UPDATE wop_user (name, email) VALUES (?, ?)', [user.name, user.username]);
  console.log('insert row', row);
  return row.insertId;
};

const getUserLogin = async (params) => {
  try {
    console.log(params);
    const [rows] = await promisePool.execute(
        'SELECT * FROM wop_user WHERE email = ?;',
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
