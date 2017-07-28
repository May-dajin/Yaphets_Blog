'use strict';
const mongoose = require('mongoose');
const EssaySchema = require('../schema/essay');

module.exports = mongoose.model('EssayModel', EssaySchema);