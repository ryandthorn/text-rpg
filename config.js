'use strict';
exports.PORT = process.env.PORT || 8080;
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://test:sconnie1@ds213183.mlab.com:13183/text-rpg';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://test:sconnie1@ds253804.mlab.com:53804/text-rpg-test';
exports.JWT_SECRET = 'Thinkful';
exports.JWT_EXPIRY = '7d';
// Heroku: set initial value to process.env