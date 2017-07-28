'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EssaySchema = new Schema({
    title: String,
    poster: String,
    author: String,
    summary: String,    
    content: String,
    origin: String,
    view: {
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    },
    comments: {
        type: Array,
        default: []
    }
});

//保存前先判断是更新时间
EssaySchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }
    next();
});

// 定义静态方法
EssaySchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})   // 查找单条数据
            .exec(cb);
    },
    getMainPage: function (pageSize, cb) {
        return this
            .find({})
            .sort({"meta.createAt": -1})
            .limit(pageSize)
            .exec(cb);
    },
    turnPage: function (skip, limit, cb) {
        return this
            .find({})
            .skip(skip)
            .limit(limit)
            .sort({"meta.createAt": -1})
            .exec(cb);
    }
};

module.exports = EssaySchema;