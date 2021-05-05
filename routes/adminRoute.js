//'use strict'; module is strict by default 😉
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.route('/')
  .get((req, res) => {
    res.send({userId : req.user.userId});
  });
  
router.route('/users/')  
  .get(adminController.user_list_get);

module.exports = router;
