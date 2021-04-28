//'use strict'; module is strict by default 😉
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.route('/')
    .post([
        body('name', 'minimum of 1 characters').isLength({min: 1}),
        body('email').isEmail(),
        body('message', 'minimum of 1 characters').isLength({min: 1})
        ], contactController.insertContact
    );




module.exports = router;
