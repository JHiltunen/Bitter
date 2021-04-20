'use strict';
const express = require('express');
const { body, check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const currentDate = Date();

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/register',
    [
      body('firstname', 'minimum 3 characters').isLength({min: 3}),
      body('lastname', 'minimum 3 characters').isLength({min: 3}),
      body('username', 'email is not valid').isEmail(),
      check('dateOfBirth').custom((dateOfBirth, {req}) => {
        if (currentDate < body('dateOfBirth')) {
          throw new Error('Birthdate can not be in the future');
        } else {
          return true;
        }
      }),
      // TODO. REGEX for gender enum
      body('password', 'at least one upper case letter').
          matches('(?=.*[A-Z]).{8,}'),
    ],
    authController.user_create_post,
    authController.login,
);

module.exports = router;