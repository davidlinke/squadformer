const express = require('express');
const squad = express.Router();

const group = require('../models/group.js');

squad.get('/new', (req, res) => {
	res.render('newSquad.ejs');
});

squad.post('/', (req, res) => {
	// console.log(req.body);
	const names = {
		names: separateNames(req.body.names)
	};
	// console.log(names);
	group.create(names, (err, createdSquad) => {
		if (err) {
			console.log(err);
		}
		// console.log(createdSquad);
		res.redirect('/');
	});
});

module.exports = squad;

// Split names by newline into array of strings
const separateNames = stringOfNames => {
	return stringOfNames.split('\r\n');
};
