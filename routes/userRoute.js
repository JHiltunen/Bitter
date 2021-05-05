//'use strict'; module is strict by default 😉
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const forumController = require('../controllers/forumController');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

router.route('/')
  .get((req, res) => {
    res.send({userId : req.user.userId});
  });

module.exports = router;
