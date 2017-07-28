'use strict';
const mongoose = require('mongoose');
const UserSchema = require('../schema/users');

module.exports = mongoose.model('UserModel', UserSchema);