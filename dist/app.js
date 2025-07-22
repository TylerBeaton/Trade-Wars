"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// This file is part of the Express.js application setup.
require('dotenv').config();
require("dotenv/config"); // Load environment variables from .env file'
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const sequelize_1 = require("sequelize");
// Import models
const user_1 = __importDefault(require("./models/user"));
// Import routes
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
// Initialize Sequelize with PostgreSQL connection
const sequelize = new sequelize_1.Sequelize((_a = process.env.DB_NAME) !== null && _a !== void 0 ? _a : 'database', (_b = process.env.DB_USER) !== null && _b !== void 0 ? _b : 'user', (_c = process.env.DB_PASSWORD) !== null && _c !== void 0 ? _c : 'password', {
    host: (_d = process.env.DB_HOST) !== null && _d !== void 0 ? _d : 'localhost',
    dialect: 'postgres',
});
// After setting up sequelize
const User = (0, user_1.default)(sequelize);
// Test the database connection
sequelize.authenticate()
    .then(() => console.log('Connected to PostgreSQL!'))
    .catch(err => console.error('Connection error:', err));
// Sync models with the database
sequelize.sync()
    .then(() => console.log('Synced models to database'))
    .catch(err => console.error('Sync error:', err));
// Create an Express application
var app = (0, express_1.default)();
exports.app = app;
// view engine setup
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Middleware setup
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Set up routes
app.use('/', index_1.default);
app.use('/users', (0, users_1.default)(User));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
