//'use strict'; module is strict by default 😉
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

router.route('/')
  .get((req, res) => {
    res.send('Users information and frontpage');
  });

router.route('/post')
.post(upload.single('image'), userController.create_post)

module.exports = router;
