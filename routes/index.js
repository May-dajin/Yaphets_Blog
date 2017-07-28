'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const db = 'mongodb://localhost/blog';
const Index = require('../app/controller/index');
const User = require('../app/controller/user');
const Essay = require('../app/controller/essay');

mongoose.connect(db);

router.use(session({
    secret: 'essay',
    store: new mongoStore({
        url: db,
        collection: 'sessions'
    })
}));

router.use(function(req, res, next) {
	let _user = req.session.user;
    res.locals.user = _user;
	next();
});

/** print log message */
mongoose.connection.on('connected', () => {
	console.log(`Mongoose connected to ${db}`);
});

mongoose.connection.on('error', (err) => {
	console.log(`Mongoose connection error ${err}`);
});

mongoose.connection.on('disconnected', () => {
	console.log('Mongoose disconnected');
});

/* route for home page */
router.get('/', Index.render);
/* route for friend link */
router.get('/link', Index.link);
/* route for about me */
router.get('/about', Index.about);
/* route for turn page */
router.get('/page', Index.page);

/* route for login */
router.get('/login', (req, res) => {
	res.render('login');
});
/* route for logout */
router.get('/logout', User.signout);
/* route for confirm login */
router.post('/login/user', User.signin);

/* route for essay detail */
router.get('/essay/:id', Essay.detail);
/* route for create */
router.get('/admin/essay/new', User.signinRequired, Essay.new);
/* route for save */
router.post('/admin/essay', User.signinRequired, Essay.save);
/* route for update */
router.get('/admin/essay/update/:id', User.signinRequired, Essay.update);
/* route for delete */
router.delete('/admin/essay/delete', User.signinRequired, Essay.delete)
/* route for comments */
router.post('/essay/comments', Essay.commentsSave);
/* route for admin-essay-list */
router.get('/admin/essay/list', User.signinRequired, Essay.showList);

module.exports = router;
