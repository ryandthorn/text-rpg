'use strict';
const dotenv = require('dotenv');
dotenv.config();
exports.PORT = process.env.PORT || 8080;
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = Math.floor(Date.now() / 1000) + (60 * 60);
