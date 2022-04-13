const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const Todo = require('./models/todo');
const methodOverride = require('method-override');
require('dotenv').config();

const port = 3000;

const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', () => {
	console.log('mongodb error');
});

db.once('open', () => {
	console.log('mongodb connected.');
});

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
	Todo.find()
		.sort({ name: 'asc' })
		.lean()
		.then(todos => res.render('index', { todos }))
		.catch(error => {
			console.log(error);
		});
});

app.get('/todos/new', (req, res) => {
	res.render('new');
});

app.post('/todos', (req, res) => {
	const name = req.body.name;
	return Todo.create({ name })
		.then(() => res.redirect('/'))
		.catch(error => console.log(error));
});

app.get('/todos/:id', (req, res) => {
	const id = req.params.id;
	return Todo.findById(id)
		.lean()
		.then(todo => res.render('detail', { todo }))
		.catch(error => console.log(error));
});

app.get('/todos/:id/edit', (req, res) => {
	const id = req.params.id;
	return Todo.findById(id)
		.lean()
		.then(todo => res.render('edit', { todo }))
		.catch(error => console.log(error));
});

app.put('/todos/:id', (req, res) => {
	const id = req.params.id;
	const { name, isDone } = req.body;
	return Todo.findById(id)
		.then(todo => {
			todo.name = name;
			todo.isDone = isDone === 'on';
			return todo.save();
		})
		.then(() => res.redirect(`/todos/${id}`))
		.catch(error => console.log(error));
});

app.delete('/todos/:id', (req, res) => {
	const id = req.params.id;

	return Todo.findById(id)
		.then(todo => todo.remove())
		.then(() => res.redirect('/'))
		.catch(error => console.log(error));
});

app.listen(port, () => {
	console.log(`Server is listening on http://localhost:${port}`);
});
