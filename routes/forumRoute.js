const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const passport = require('../utils/pass');
const forumController = require('../controllers/forumController');
const postController = require('../controllers/postController');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});


router.get('/posts', forumController.post_list_get);

router.get('/comments/:id', forumController.comment_list_get);

router.route('/post')
.post(passport.authenticate('jwt', {session: false}), upload.single('image'), postController.make_thumbnail, [
  body('title', 'minimum of 1 characters').isLength({min: 1}),
  body('content', 'minimum of 1 characters').isLength({min: 1}),
], postController.create_post);

router.route('/post/:id')
    .put(passport.authenticate('jwt', {session: false}), postController.edit_post)
    .delete(passport.authenticate('jwt', {session: false}), postController.post_delete);

router.route('/post/:id/likes/')
    .post(passport.authenticate('jwt', {session: false}), postController.insert_like)
    .delete(passport.authenticate('jwt', {session: false}), postController.delete_like);

router.route('/post/:id/dislikes/')
  .post(passport.authenticate('jwt', {session: false}), postController.insert_dislike)
  .delete(passport.authenticate('jwt', {session: false}), postController.delete_dislike);

router.route('/postComment')
  .post(passport.authenticate('jwt', {session: false}),
    [body('comment', 'minimum of 1 characters').isLength({min: 1}).trim().escape().blacklist(';')],
    postController.create_comment);

module.exports = router;