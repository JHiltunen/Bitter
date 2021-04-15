'use strict';
const jwt = require('jsonwebtoken');
const passport = require('../utils/pass');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');

const login = (req, res) => {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user,
      });
    }
    req.login(user, {session: false}, (err) => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user, 'gfdrtfyui987654rtyuio8765ewwertyu');
      return res.json({user, token});
    });
  })(req, res);
};

const user_create_post = async (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req); // TODO require validationResult, see userController

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    const salt = bcrypt.genSaltSync(12);
    const user = {};
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = bcrypt.hashSync(req.body.password, salt);
    
    const id = await userModel.insertUser(user);
    if (id > 0) {
      next();
    } else {
      res.status(400).json({error: 'register error'});
    }
  }
};

const logout = (req, res) => {
  req.logout();
  res.json({message: 'logout'});
};

module.exports = {
  login,
  logout,
  user_create_post,
};