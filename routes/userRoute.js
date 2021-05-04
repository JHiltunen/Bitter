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

router.route('/post')
.post(upload.single('image'), forumController.make_thumbnail, [
  body('title', 'minimum of 1 characters').isLength({min: 1}),
  body('content', 'minimum of 1 characters').isLength({min: 1}),
], forumController.create_post);

router.route('/postComment')
  .post(
    [body('comment', 'minimum of 1 characters').isLength({min: 1}).trim().escape().blacklist(';')],
    forumController.create_comment);

router.route('/update-post/:id')
  .put(forumController.edit_post);
router.delete('/delete-post/:id', forumController.post_delete);
module.exports = router;
