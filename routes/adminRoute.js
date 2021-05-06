//'use strict'; module is strict by default 😉
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.route('/users/')  
  .get(adminController.user_list_get);

router.route('/update-user/:id')  
  .put(adminController.update_user);

module.exports = router;
