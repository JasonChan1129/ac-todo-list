const express = require('express');
const router = express.Router();
const passport = require('passport');

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
	// only create user data if user does not exists yet.
	User.findOne({ email })
		.then(user => {
			if (user) {
				console.log('user already existed');
				return res.render('register', { username, email, password, confirmPassword });
			} else {
				// create user data
				User.create({ username, email, password })
					.then(() => {
						console.log('user created');
						return res.redirect('/');
					})
					.catch(err => {
						console.log(err);
					});
			}
		})
		.catch(err => console.log(err));
});

module.exports = router;
