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
.post(upload.single('image'), [
  body('title', 'minimum of 1 characters').isLength({min: 1}),
  body('content', 'minimum of 1 characters').isLength({min: 1}),
], userController.create_post);



module.exports = router;
