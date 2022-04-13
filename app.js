const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const routes = require('./routes');
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

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(routes);

app.listen(port, () => {
	console.log(`Server is listening on http://localhost:${port}`);
});
