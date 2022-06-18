const bcrypt = require('bcryptjs');
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

// connect mongoDB and return the connection result to db
const Todo = require('../todo');
const User = require('../user');
const db = require('../../config/mongoose');
const SEED_USER = {
	username: 'root',
	email: 'root@example.com',
	password: '12345678',
};

db.once('open', () => {
	bcrypt
		.genSalt(10)
		.then(salt => bcrypt.hash(SEED_USER.password, salt))
		.then(hash => {
			return User.create({
				username: SEED_USER.username,
				email: SEED_USER.email,
				password: hash,
			});
		})
		.then(user => {
			const userId = user._id;
			return Promise.all(
				Array.from({ length: 10 }, (_, i) => Todo.create({ name: `name-${i}`, userId }))
			);
		})
		.then(() => {
			console.log('done.');
			process.exit();
		});
});
