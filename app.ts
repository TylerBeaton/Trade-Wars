// This file is part of the Express.js application setup.
require('dotenv').config();
import 'dotenv/config'; // Load environment variables from .env file'

// import modules
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { HttpError } from './interfaces/httpError';
import { Sequelize, DataTypes } from 'sequelize';

// Import models
import UserModel from './models/user';

// Import routes
import indexRouter from './routes/index';
import userRouter from './routes/users';

const PROJECT_ROOT = process.cwd();

// Initialize Sequelize with PostgreSQL connection
const sequelize = new Sequelize(
    process.env.DB_NAME ?? 'database',
    process.env.DB_USER ?? 'user',
    process.env.DB_PASSWORD ?? 'password', 
    {
        host: process.env.DB_HOST ?? 'localhost',
        dialect: 'postgres',
    }
);

// After setting up sequelize
const User = UserModel(sequelize);

// Test the database connection
sequelize.authenticate()
    .then(() => console.log('Connected to PostgreSQL!'))
    .catch(err => console.error('Connection error:', err));

// Sync models with the database
sequelize.sync()
    .then(() => console.log('Synced models to database'))
    .catch(err => console.error('Sync error:', err));

// Create an Express application
var app = express();

// view engine setup
app.set('views', path.join(PROJECT_ROOT, 'views'));
app.set('view engine', 'pug');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(PROJECT_ROOT, 'public')));

// Set up routes
app.use('/', indexRouter);
app.use('/users', userRouter(User));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Export the app to run with a server
export { app };
