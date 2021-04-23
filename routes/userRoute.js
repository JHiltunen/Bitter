//'use strict'; module is strict by default 😉
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/')
  .get((req, res) => {
    res.send('Users information and frontpage');
  });

module.exports = router;
