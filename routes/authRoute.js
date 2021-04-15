'use strict';
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/register',
    [
      body('name', 'minimum 3 characters').isLength({min: 3}),
      body('username', 'email is not valid').isEmail(),
      body('password', 'at least one upper case letter').
          matches('(?=.*[A-Z]).{8,}'),
      body('name').isLength({ min: 3 }).trim().escape().blacklist(';'),
    ],
    authController.user_create_post,
    authController.login,
);

module.exports = router;