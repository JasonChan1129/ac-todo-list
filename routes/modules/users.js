const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

// import models
const User = require('../../models/user');

router.get('/login', (req, res) => {
	res.render('login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
	})
);

router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', (req, res) => {
	const { username, email, password, confirmPassword } = req.body;

	const errors = [];
	if (!username || !email || !password || !confirmPassword) {
		errors.push({ message: '所有欄位都是必填。' });
	}
	if (password !== confirmPassword) {
		errors.push({ message: '密碼與確認密碼不相符!' });
	}
	if (errors.length) {
		return res.render('register', { username, email, password, confirmPassword, errors });
	}

	// only create user data if user does not exists yet.
	User.findOne({ email })
		.then(user => {
			if (user) {
				errors.push({ message: '這個 Email 已經註冊過了。' });
				return res.render('register', { username, email, password, confirmPassword, errors });
			}
			// hash password
			return bcrypt
				.genSalt(10)
				.then(salt => {
					console.log(salt);
					return bcrypt.hash(password, salt);
				})
				.then(hash => {
					console.log(hash);
					// create user data
					return User.create({ username, email, password: hash })
						.then(() => {
							console.log('user created');
							return res.redirect('/');
						})
						.catch(err => {
							console.log(err);
						});
				});
		})
		.catch(err => console.log(err));
});

router.get('/logout', (req, res) => {
	req.logout(err => {
		console.log(err);
		req.flash('success_msg', '你已經成功登出。');
		res.redirect('/users/login');
	});
});

module.exports = router;
