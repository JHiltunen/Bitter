'use strict';
require('dotenv').config();
const express = require('express');
const logger = require('./utils/winston');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path')
const cors = require('cors');
const contactRoute = require('./routes/contactRoute');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const passport = require('./utils/pass');
const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');
const app = express();
const port = process.env.HTTP_PORT || 3001;

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// Setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

// decide whether using production or localhost environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'production') {
  logger.info("Environment: production");
  require('./utils/production')(app, port);
} else {
  logger.info("Environment: development");
  require('./utils/localhost')(app, process.env.HTTPS_PORT || 8001, port);
}

// root directory
app.get('/', (req, res) => {
  res.send('Hello Secure World!');
});

// custom middleware to check which role user has
const needsGroup = (role) => {
  return (req, res, next) => {
    Object.entries(req.user).forEach(([key,value]) => {
      console.log(key,value)
    })

    // check if loggedin user roles corresponds to the required role 
    if (req.user && req.user.name === role) {
      logger.info(`User: ${req.user}`);
      logger.info(`User role: ${req.user.name}`);
      next();
    } else {
      logger.info(`User: ${req.user}`);
      logger.error(`User doesn't have required role (${req.user.name}) to access ${req.originalUrl}`);
      res.status(401).send('Unauthorized');
    }  
  };
};


app.use(cors());

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));
app.use(express.static('uploads'));
app.use('/thumbnails', express.static('thumbnails'));
// routes
app.use('/contact', contactRoute);
app.use('/forum', postRoute);
app.use('/auth', authRoute);
app.use('/user', passport.authenticate('jwt', {session: false}), needsGroup('User'), userRoute);
app.use('/admin', passport.authenticate('jwt', {session: false}), needsGroup('Admin'), adminRoute);