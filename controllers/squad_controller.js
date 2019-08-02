const express = require('express');
const squad = express.Router();

const group = require('../models/group.js');

squad.get('/new', (req, res) => {
	res.render('newSquad.ejs');
});

// CLEANER SYNTAX, CAN CHAIN SAME ENDPOINTS
// squad.route('/new')
// 	.get((req, res) => {
// 		res.render('newSquad.ejs');
// 	});

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
		res.redirect('/squads/' + createdSquad.id);
	});
});

squad.get('/:id', (req, res) => {
	group.findById(req.params.id, (err, foundSquad) => {
		if (err) {
			console.log(err);
		}
		res.render('viewSquad.ejs', {
			foundSquad: foundSquad
		});
		console.log(foundSquad);
	});
});

squad.get('/data/:id', (req, res) => {
	group.findById(req.params.id, (err, foundSquad) => {
		if (err) {
			console.log(err);
		}
		res.send(foundSquad);
	});
});

squad.get('/randomize/:size/:id', (req, res) => {
	group.findById(req.params.id, (err, foundSquad) => {
		if (err) {
			console.log(err);
		}
		const groups = makeGroups(foundSquad, req.params.size);
		res.send(groups);
	});
});

module.exports = squad;

// Split names by newline into array of strings
const separateNames = stringOfNames => {
	return stringOfNames.split('\r\n');
};

// Generate Random Combinations
const makeGroups = (squadObject, groupSize) => {
	let squadNames = squadObject.names;

	// Function Source
	// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	const shuffleArray = array => {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	};

	shuffleArray(squadNames);

	const groupsArray = [];

	for (let i = 0; i < squadNames.length; i = i + Number(groupSize)) {
		// console.log(`i is ${i}`);
		const tempArray = [];
		for (let j = 0; j < Number(groupSize); j++) {
			// console.log(`j is ${j}`);
			if (squadNames[i + j]) {
				tempArray.push(squadNames[i + j]);
			}
			// console.log('temp array is:');
			// console.log(tempArray);
		}
		groupsArray.push(tempArray);
	}
	// console.log(squadNames);
	console.log(groupsArray);
	return groupsArray;
};
