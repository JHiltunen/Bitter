const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});


router.get('/posts', postController.post_list_get);

module.exports = router;