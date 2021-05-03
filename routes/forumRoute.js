const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const forumController = require('../controllers/forumController');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});


router.get('/posts', forumController.post_list_get);

router.get('/comments/:id', forumController.comment_list_get);
router.delete('/delete-post/:id', forumController.post_delete);
module.exports = router;