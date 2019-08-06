const express = require('express');
const squad = express.Router();
const squadModel = require('../models/group.js');

// Need below for creating objectId's to work
let ObjectId = require('mongodb').ObjectID;

//////////////////////////////////////////////////
// CREATE SQUAD POST FUNCTION
//////////////////////////////////////////////////
squad.post('/', (req, res) => {
	const names = separateNames(req.body.names);

	const newSquadNames = [];

	names.forEach(personName => {
		// const personID = new ObjectId();

		const personObj = {
			name: personName,
			absent: false,
			archived: false
			// id: personID
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
		// console.log(createdSquad);
	});
});

//////////////////////////////////////////////////
// GET MAKE RANDOM GROUPS PAGE
//////////////////////////////////////////////////
squad.get('/:id', (req, res) => {
	squadModel.findById(req.params.id, (err, foundSquad) => {
		if (err) {
			console.log(err);
		}
		res.render('viewSquad.ejs', {
			foundSquad: foundSquad
		});
		// console.log(foundSquad);
	});
});

//////////////////////////////////////////////////
// GET SQUAD NAME
//////////////////////////////////////////////////
squad.get('/data/:id/squadname', (req, res) => {
	squadModel.findById(req.params.id, (err, foundSquad) => {
		if (err) {
			console.log(err);
		}
		res.send(foundSquad.squadName);
	});
});

//////////////////////////////////////////////////
// GET PEOPLE IN SQUAD NAMES
//////////////////////////////////////////////////
squad.get('/data/:id/names', (req, res) => {
	squadModel.findById(req.params.id, (err, foundSquad) => {
		if (err) {
			console.log(err);
		}
		// console.log(foundSquad.names);
		// console.log('api sending names array now');
		res.send(foundSquad.names);
	});
});

//////////////////////////////////////////////////
// MAKE RANDOM GROUPS
//////////////////////////////////////////////////
squad.get('/randomize/:size/:id', (req, res) => {
	squadModel.findById(req.params.id, (err, foundSquad) => {
		if (err) {
			console.log(err);
		}
		const groups = makeGroups(foundSquad, req.params.size);
		res.send(groups);
	});
});

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
