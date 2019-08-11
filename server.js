const express = require('express');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');
const PORT = process.env.PORT || 3000;
const squadController = require('./controllers/squad_controller.js');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/squad';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, () => {
	console.log('connected to mongo database');
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.use('/squads', squadController);

app.get('/', (req, res) => {
	res.render('index.ejs');
});

app.use(function(req, res) {
	res.status(400);
	console.log('there seems to be a 404 error');
	res.render('error.ejs', { title: '404: File Not Found' });
});

app.use(function(error, req, res, next) {
	res.status(500);
	console.log('there seems to be a 500 error');
	res.render('error.ejs', {
		title: '500: Internal Server Error',
		error: error
	});
});

app.listen(PORT, () => console.log('Listening on port:', PORT));
