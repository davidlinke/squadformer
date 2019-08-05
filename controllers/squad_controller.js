const express = require('express');
const squad = express.Router();

// MAYBE DONT NEED
const mongoose = require('mongoose');
let ObjectId = require('mongodb').ObjectID;

// const Schemas = require('../models/group.js');

const squadModel = require('../models/group.js');

squad.post('/', (req, res) => {
	const names = separateNames(req.body.names);

	const newSquadNames = [];

	names.forEach(personName => {
		const personID = new ObjectId();

		const personObj = {
			name: personName,
			absent: false,
			archived: false,
			id: personID
		};

		newSquadNames.push(personObj);
	});

	const newSquad = {
		squadName: 'My Squad',
		names: newSquadNames,
		pastGroups: [],
		pastCombinations: {}
	};

	squadModel.create(newSquad, (err, createdSquad) => {
		if (err) {
			console.log(err);
		}
		res.redirect('/squads/' + createdSquad.id);
	});
});

// OLD POST FUNCTION
// squad.post('/', (req, res) => {
// 	// console.log(req.body);
// 	const names = {
// 		names: separateNames(req.body.names)
// 	};
// 	// console.log(names);
// 	Schemas.group.create(names, (err, createdSquad) => {
// 		if (err) {
// 			console.log(err);
// 		}
// 		res.redirect('/squads/' + createdSquad.id);
// 	});
// });

// squad.post('/', (req, res) => {
// 	// console.log(req.body);
// 	const newSquad = {
// 		squadName: 'My Squad'
// 	};

// 	let newSquadId = null;
// 	let newNamesId = null;

// 	const names = separateNames(req.body.names);

// 	const newSquadNames = [];

// 	names.forEach(personName => {
// 		const personObj = {
// 			name: personName,
// 			absent: false,
// 			archived: false
// 		};

// 		newSquadNames.push(personObj);
// 	});

// 	Schemas.group.create(newSquad, (err, createdSquad) => {
// 		newSquadId = createdSquad.id;
// 		console.log(createdSquad);
// 	});

// 	Schemas.names.create(newSquadNames, (err, createdSquadNames) => {
// 		newNamesId = createdSquadNames.id;
// 		console.log(createdSquadNames);
// 	});

// 	Schemas.group.findByIdAndUpdate(newSquadId, function(err, user) {
// 		$set: {
// 			names: newNamesId;
// 		}
// 	});

// 	console.log(newSquadId);
// 	console.log(newNamesId);

// 	Schemas.group.findById(newSquadId, function(err, user) {
// 		console.log(user);
// 	});

// 	Schemas.group.findById(newNamesId, function(err, user) {
// 		console.log(user);
// 	});

// 	// const names = {
// 	// 	names: separateNames(req.body.names)
// 	// };
// 	// console.log(names);
// 	// Schemas.group.create(names, (err, createdSquad) => {
// 	// 	if (err) {
// 	// 		console.log(err);
// 	// 	}
// 	// 	res.redirect('/squads/' + createdSquad.id);
// 	// });
// });

squad.get('/:id', (req, res) => {
	squadModel.findById(req.params.id, (err, foundSquad) => {
		if (err) {
			console.log(err);
		}
		res.render('viewSquad.ejs', {
			foundSquad: foundSquad
		});
		console.log(foundSquad);
	});
});

// squad.get('/data/:id', (req, res) => {
// 	Schemas.group.findById(req.params.id, (err, foundSquad) => {
// 		if (err) {
// 			console.log(err);
// 		}
// 		res.send(foundSquad);
// 	});
// });

// squad.get('/randomize/:size/:id', (req, res) => {
// 	Schemas.group.findById(req.params.id, (err, foundSquad) => {
// 		if (err) {
// 			console.log(err);
// 		}
// 		const groups = makeGroups(foundSquad, req.params.size);
// 		res.send(groups);
// 	});
// });

module.exports = squad;

//////////////////////////////////////////////////
// HELPER FUNCTIONS
//////////////////////////////////////////////////

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
