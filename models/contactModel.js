'use strict';
const pool = require('../database/db');
const logger = require('../utils/winston');
const promisePool = pool.promise();

const insertContact = async (contact) => {
  try {
    logger.info(`Prepare for database ${contact}`);
    const [rows] = await promisePool.execute('INSERT INTO contacts (name, email, message, hasBeenRead, vst) VALUES(?, ?, ?, \'false\', now())', contact);
    logger.info(`Insert row on insertContact: ${JSON.stringify(rows)}`);
    return rows;
  } catch (e) {
    logger.error(`Error on contactModel.insertContact while inserting to database ${e}`);
  }
};
module.exports = {
  insertContact,
};