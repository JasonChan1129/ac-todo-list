const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');

const routes = require('./routes');
// connect mongoDB
require('./config/mongoose');

const port = 3000;
const app = express();

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(routes);

app.listen(port, () => {
	console.log(`Server is listening on http://localhost:${port}`);
});
