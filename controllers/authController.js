'use strict';
const jwt = require('jsonwebtoken');
const passport = require('../utils/pass');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const {validationResult} = require('express-validator');
const logger = require('../utils/winston');

// handle login
// use passport and jwt for token
const login = (req, res) => {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    logger.info(`User: ${JSON.stringify(user)} tries to login`);
    if (err || !user) {
      logger.error('Error in login. res.status(400)');
      logger.error(`Error ${err}. In login, user doesn't exists, user: ${JSON.stringify(user)}`);
      return res.status(400).json({
        message: 'Something is not right',
        user: user,
      });
    }
    req.login(user, {session: false}, (err) => {
      if (err) {
        logger.error(`${err}`)
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user, 'gfdrtfyui987654rtyuio8765ewwertyu');
      logger.info(`Created token ${token} to sign in!`)
      // return token for the loggedin user
      return res.json({user, token});
    });
  })(req, res);
};

const user_create_post = async (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req); // TODO require validationResult, see userController

  // if errors array isn't empty
  if (!errors.isEmpty()) {
    logger.error(`Errors in user registration forms: ${errors}`);
    return res.status(400).json({ errors: errors.array() });
  } else {
    // generate salt for hashed password
    const salt = bcrypt.genSaltSync(12);
    // create user object to store data
    const user = {};
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.username = req.body.username;
    user.dateOfBirth = req.body.dateOfBirth;
    user.gender = req.body.gender;
    user.password = bcrypt.hashSync(req.body.password, salt);
    logger.info(`User to be created: ${JSON.stringify(user)}`);
    // insert new 
    const id = await userModel.insertUser(user);
    if (id > 0) {
      next();
    } else {
      logger.error(`Error with creating new user: ${id}`);
      res.status(400).json({error: 'register error'});
    }
  }
};

// logout
const logout = (req, res) => {
  logger.info(`Logout ${JSON.stringify(req.body)}`);
  req.logout();
  res.json({message: 'logout'});
};

module.exports = {
  login,
  logout,
  user_create_post,
};