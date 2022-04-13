const Todo = require('../todo');
// connect mongoDB and return the connection result to db
const db = require('../../config/mongoose');

db.once('open', () => {
	for (let i = 0; i < 10; i++) {
		Todo.create({ name: `name-${i}` });
	}
	console.log('done');
});
