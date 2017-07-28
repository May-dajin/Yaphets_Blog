'use strict';
const EssayModel = require('../models/essay');
const multer = require('multer');
const fs = require('fs');
const _ = require('lodash');

const upload = multer({dest: 'public/images/'}).single('poster');

module.exports = {
    new: (req, res) => {
        res.render('admin', {
            essay: {
                title: '新建文章',
                poster: '',
                author: '',
                content: '',
                summary: ''
            }
        });
    },
    delete: (req, res) => {
        let id = req.query.id;
        if (id) {
            EssayModel.findById(id, (err, essay) => {
                if (err) {
                    console.log(err);
                }
                essay.remove((err) => {
                    if (err) {
                        console.log(err);
                        res.json({status: 0});
                    }
                    res.json({status: 1});
                });
            });
        } else {
            res.json({statue: 0});
        }
    },
    save: (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                console.log(err);
            }
            let essayObj = req.body;
            let id = essayObj._id;
            const poster = req.file;
            let originalName = poster.originalname;
            let changePath = `public/images/${originalName}`;
            let path = `/images/${originalName}`;
            let _essay;

            fs.renameSync(poster.path, changePath);

            if (id === 'undefined') {
                _essay = new EssayModel({
                    title: essayObj.title,
                    poster: `${path}`,
                    author: essayObj.author,
                    summary: essayObj.summary,
                    content: essayObj.content,
                    origin: essayObj.origin
                });
                _essay.save((err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    res.redirect(`/essay/${result._id}`);
                });
            } else {
                EssayModel.findById(id, (err, essay) => {
                    if (err) {
                        console.log(err);
                    }
                    _essay = _.extend(essay, essayObj);
                    _essay.save((err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        res.redirect(`/essay/${id}`);
                    });
                });
            }
        });
    },
    update: (req, res) => {
        let {id} = req.params;
        if (id) {
            EssayModel.findById(id, (err, essay) => {
                if (err) {
                    console.log(err);
                }
                res.render('admin', {
                    essay: essay
                });
            });
        }
    },
    detail: (req, res) => {
        let {id} = req.params;

        EssayModel.update({_id: id}, {$inc: {"view": 1}}, (err) => {
            console.log('update');
            if (err) {
                console.log(err);
            }
        });

        EssayModel.findById(id, (err, essay) => {
            if (err) {
                console.log(err);
            }
            console.log(essay);
            res.render('detail', {
                essay: essay
            });
        });
    },
    commentsSave: (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                console.log(err);
            }
            let essayObj = req.body;
            let {_id} = essayObj;
            let _essay;
            if (_id !== 'undefined') {
                EssayModel.findById(_id, (err, essay) => {
                    if (err) {
                        console.log(err);
                    }
                    let now = new Date();
                    let date = now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate();
                    let commentsObj = {
                        text: essayObj.text,
                        name: essayObj.name,
                        email: essayObj.email,
                        date: date
                    };
                    essay.comments.push(commentsObj);
                    console.log(essay);
                    essay.save((err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        res.redirect(`/essay/${_id}`);
                    });
                    
                });
            }
        });
    },
    showList: (req, res) => {
        EssayModel.fetch((err, essays) => {
            if (err) {
                console.log(err);
            }
            res.render('showlist', {
                essays: essays
            });   
        });
    }
};