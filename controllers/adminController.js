// Controller
'use strict';
const adminModel = require('../models/adminModel');
const {validationResult} = require('express-validator');

// get list of all users
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

const update_user = async (req, res) => {
  console.log('get all users from controllers', req.user);
  if (req.user.name === 'Admin') {

    const user = [
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      req.body.dateOfBirth,
      req.body.gender,
      req.body.userId,
    ];

    const updateUser = await adminModel.updateUser(user);
    res.json(updateUser);
  }
}

module.exports = {
  user_list_get,
  update_user,
};