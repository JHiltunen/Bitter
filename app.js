'use strict';
require('dotenv').config();
const express = require('express');

const cors = require('cors');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const passport = require('./utils/pass');
const authRoute = require('./routes/authRoute');
const app = express();
const port = process.env.HTTP_PORT || 3001;

// decide whether using production or localhost environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'production') {
  require('./utils/production')(app, port);
} else {
  require('./utils/localhost')(app, process.env.HTTPS_PORT || 8001, port);
}

// root directory
app.get('/', (req, res) => {
  res.send('Hello Secure World!');
});

// custom middleware to check which role user has
const needsGroup = function(role) {
  return function(req, res, next) {
    Object.entries(req.user).forEach(([key,value]) => {
      console.log(key,value)
    })

    // check if loggedin user roles corresponds to the required role 
    if (req.user && req.user.name === role) {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }  
  };
};


app.use(cors());

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));

// routes
app.use('/auth', authRoute);
app.use('/user', passport.authenticate('jwt', {session: false}), needsGroup('User'), userRoute);
app.use('/admin', passport.authenticate('jwt', {session: false}), needsGroup('Admin'), adminRoute);