//'use strict'; module is strict by default 😉
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/')
  .get((req, res) => {
    res.send('Users information and frontpage');
  });

router.route('/post')
    .post(
    body('title').isLength({min: 1}).trim().escape().blacklist(';'),
    body('content').isLength({min: 1}),
    userController.create_post
);

module.exports = router;
