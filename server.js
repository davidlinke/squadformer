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

app.listen(PORT, () => console.log('Listening on port:', PORT));
