/**
CREATE TABLE `users` (
	`idx`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`email`	TEXT NOT NULL UNIQUE,
	`password`	TEXT NOT NULL,
	`nickname`	TEXT NOT NULL,
	`createDate`	TEXT
);
 */

const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get("/login", (req, res, next) => {
    res.render('user/login', { menu: ['유저', '로그인'] });
});

router.post('/login', passport.authenticate('login', {
    successRedirect : '/'
    , failureRedirect : '/user/login'
    //, failureFlash: true
}));

module.exports = router;