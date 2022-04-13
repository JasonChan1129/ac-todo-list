const express = require('express');
const router = express.Router();

const Todo = require('../../models/todo');

router.get('/', (req, res) => {
	Todo.find()
		.sort({ name: 'asc' })
		.lean()
		.then(todos => res.render('index', { todos }))
		.catch(error => {
			console.log(error);
		});
});

module.exports = router;
