// Controller
'use strict';
const adminModel = require('../models/adminModel');
const {validationResult} = require('express-validator');

const user_list_get = async (req, res) => {
    console.log('get all users from controllers', req.user);
    if (req.query.sort === 'name') {
        const usersSort = await adminModel.getAllUsersSort('name');
        res.json(usersSort);
        return;
    }
    
    const users = await adminModel.getAllUsers();
    res.json(users);   
}

module.exports = {
  user_list_get,
};