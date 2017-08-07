'use strict';
const UserModel = require('../models/user');
module.exports = {
    //登陆
    signin: (req, res) => {
        let user = req.body;
        console.log(user);
        let {name, password} = user;
        UserModel.findOne({name: name}, (err, result) => {
            if (err) {
                console.log(err);
            }
            if (!result) {
                var _user = new UserModel({
                    name: name,
                    password: password
                });
                _user.save(() => {
                    console.log('success');
                });
                return res.redirect('/login');
            }
            result.comparePassword(password, (err, compareResult) => {//验证密码
                if (err) {
                    console.log(err);
                }
                if (compareResult) {//成功
                    req.session.user = result;
                    console.log('login success'); 
                    return res.redirect('/admin/essay/list');   
                }else {//失败
                    console.log('password is not correct!');
                    return res.redirect('/login');
                }
            });
        });
    },
    signout: (req, res) => {
        delete req.session.user;
        res.redirect('/');
    },
    signinRequired: (req, res, next) => {
	    let user = req.session.user;
	    if (!user) {
		    return res.redirect('/login');
	    }
        next();
    }
};