const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000; //heroku uses a different port

// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/DB_NAME';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, () => {
	console.log('connected to mongo database');
});

app.get('/', (req, res) => {
	res.send('app is running!');
});

app.listen(PORT, () => console.log('Listening on port:', PORT));
