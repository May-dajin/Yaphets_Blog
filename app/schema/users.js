'use strict';
const mongoose = require('mongoose');
// 引入bcrypt模块
const bcrypt = require('bcrypt');
// 定义加密密码计算强度
const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        unique: true
    },
    timeStamp: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

UserSchema.pre('save', function(next) {
    let user = this;
    if (user.isNew) {
        user.timeStamp.createAt = user.timeStamp.updateAt = Date.now();
    }else {
        user.timeStamp.updateAt = Date.now();
    }
    /** 存入前先对用户密码进行bcrypt算法加密 */
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    })
});

UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, (err, result) => {
            if (err) return cb(err);
            cb(null, result);
        });
    }
};

module.exports = UserSchema;