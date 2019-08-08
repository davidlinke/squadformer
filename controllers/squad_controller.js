const express = require('express');
const squad = express.Router();
const squadModel = require('../models/group.js');
const methodOverride = require('method-override');
squad.use(methodOverride('_method'));
squad.use(express.urlencoded({ extended: false }));

// use moment date formatting in ejs
const moment = require('moment');

// Need below for creating objectId's to work
let ObjectId = require('mongodb').ObjectID;

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
	});
});

//////////////////////////////////////////////////
// GET VIEW SAVED GROUPS PAGE
//////////////////////////////////////////////////
squad.get('/:id/:groupindex', (req, res) => {
	squadModel.findById(req.params.id, (err, foundSquad) => {
		// console.log(foundSquad.pastGroups[req.params.groupindex]);
		if (err) {
			console.log(err);
		}
		res.render('savedGroup.ejs', {
			squadName: foundSquad.squadName,
			pastGroup: foundSquad.pastGroups[req.params.groupindex],
			names: foundSquad.names,
			moment: moment
		});
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
// UPDATE SQUAD NAME
//////////////////////////////////////////////////
squad.put('/data/:id/:squadname', (req, res) => {
	squadModel.findById(req.params.id, (err, foundSquad) => {
		let updatedSquad = foundSquad;

		updatedSquad.squadName = req.params.squadname;

		squadModel.findByIdAndUpdate(
			req.params.id,
			updatedSquad,
			(error, updatedFoundSquad) => {
				if (err) {
					console.log(err);
				}
				res.send(updatedFoundSquad.squadName);

				// console.log(updatedFoundSquad);
			}
		);
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
		res.send(foundSquad.names);
	});
});

//////////////////////////////////////////////////
// GET PAST SQUAD GROUP HISTORY
//////////////////////////////////////////////////
squad.get('/data/:id/history', (req, res) => {
	// console.log('got history request');
	squadModel.findById(req.params.id, (err, foundSquad) => {
		if (err) {
			console.log(err);
		}
		// console.log(foundSquad.pastGroups);
		res.send(foundSquad.pastGroups);
	});
});

//////////////////////////////////////////////////
// GET INDEX OF LAST ADDED GROUP
//////////////////////////////////////////////////
squad.get('/data/groupindex/:id', (req, res) => {
	squadModel.findById(req.params.id, (err, foundSquad) => {
		if (err) {
			console.log(err);
		}
		// console.log(foundSquad);
		res.send(`${foundSquad.pastGroups.length - 1}`);
	});
});

//////////////////////////////////////////////////
// REMOVE PERSON FROM SQUAD
//////////////////////////////////////////////////
squad.delete('/data/:id/:nameIndex', (req, res) => {
	squadModel.findById(req.params.id, (err, foundSquad) => {
		let updatedSquad = foundSquad;

		// console.log(`nameIndex is $(req.params.nameIndex)`);

		updatedSquad.names[req.params.nameIndex].archived = true;

		squadModel.findByIdAndUpdate(
			req.params.id,
			updatedSquad,
			(error, updatedFoundSquad) => {
				if (err) {
					console.log(err);
				}
				res.send('successfully removed name');

				// console.log(updatedFoundSquad);
			}
		);
	});
});

//////////////////////////////////////////////////
// MARK PERSON AS ABSENT/NOT ABSENT IN SQUAD
//////////////////////////////////////////////////
squad.put('/data/:id/:nameIndex/:absent', (req, res) => {
	squadModel.findById(req.params.id, (err, foundSquad) => {
		let updatedSquad = foundSquad;

		// console.log(`nameIndex is ${req.params.nameIndex}`);
		// console.log(
		// 	`Absent is ${req.params.absent} and is type ${typeof req.params.absent}`
		// );

		if (req.params.absent === 'true') {
			updatedSquad.names[req.params.nameIndex].absent = false;
		} else if (req.params.absent === 'false') {
			updatedSquad.names[req.params.nameIndex].absent = true;
		}

		// console.log('Updated squad prior to pushing into the db:');
		// console.log(updatedSquad);

		squadModel.findByIdAndUpdate(
			req.params.id,
			updatedSquad,
			(error, updatedFoundSquad) => {
				if (err) {
					console.log(err);
				}
				res.send('successfully removed name');

				// console.log(updatedFoundSquad);
			}
		);
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
		const groups = makeGroups(
			foundSquad.names,
			req.params.size,
			foundSquad.pastCombinations
		);
		// console.log(groups);
		res.send(groups);
	});
});

//////////////////////////////////////////////////
// SAVE RANDOM GROUPS
//////////////////////////////////////////////////
squad.post('/savegroups/:id', (req, res) => {
	// console.log('Received:');
	// console.log(JSON.parse(req.body.groups));
	const groups = JSON.parse(req.body.groups);

	squadModel.findById(req.params.id, (err, foundSquad) => {
		if (err) {
			console.log(err);
		}

		const pastGroupCombinations = [];

		groups.forEach((group, index) => {
			// Make past combination keys and push into object
			foundSquad.pastCombinations[groupToString(group)] = true;

			// Make past groups into objects and push into pastGroupCombinations array
			const newGroup = {
				groupName: `Group ${index + 1}`,
				group: group
			};

			pastGroupCombinations.push(newGroup);
		});

		const timestamp = new Date();
		const groupID = new ObjectId();
		const newPastGroups = {
			id: groupID,
			createdAt: timestamp,
			pastGroupCombinations: pastGroupCombinations
		};

		foundSquad.pastGroups.push(newPastGroups);

		// console.log(foundSquad);

		//Push back into db
		squadModel.findByIdAndUpdate(
			req.params.id,
			foundSquad,
			{ new: true },
			(error, updatedSquad) => {
				res.send('added to db');
			}
		);
	});
});

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
		pastCombinations: { seed: '' }
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
// HELPER FUNCTIONS
//////////////////////////////////////////////////

//////////////////////////////////////////////////
// Split names by newline into array of strings
//////////////////////////////////////////////////
const separateNames = stringOfNames => {
	return stringOfNames.split('\r\n');
};

//////////////////////////////////////////////////
// Make Random Groups
//////////////////////////////////////////////////
const makeGroups = (names, groupSize, pastCombinations) => {
	// console.log('Names:');
	// console.log(names);

	// console.log('Group Size:');
	// console.log(groupSize);

	// console.log('Past Combinations:');
	// console.log(pastCombinations);

	// Handle invalid inputs
	if (names.length <= 2 || groupSize <= 1) {
		return 'invalid inputs';
	}

	// Build array of name indexes
	let nameIndexesArray = [];
	names.forEach((personObj, index) => {
		// console.log(personObj);
		if (personObj.absent === false && personObj.archived === false) {
			nameIndexesArray.push(index);
		}
	});

	// console.log('Names Array:');
	// console.log(nameIndexesArray);

	// Randomize array of name indexes
	// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	const shuffleArray = array => {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	};

	shuffleArray(nameIndexesArray);

	// console.log('Shuffled Name Indexes Array:');
	// console.log(nameIndexesArray);

	// Build groups in order of shuffled array
	const groupsArray = [];

	for (let i = 0; i < nameIndexesArray.length; i = i + Number(groupSize)) {
		const tempArray = [];
		for (let j = 0; j < Number(groupSize); j++) {
			if (nameIndexesArray[i + j] !== undefined) {
				// without != undefined, the 0 index does not get added to the groups
				tempArray.push(nameIndexesArray[i + j]);
			}
		}
		tempArray.sort();
		groupsArray.push(tempArray);
	}

	// console.log('Groups:');
	// console.log(groupsArray);

	// Return a random int between 0 and the max value passed to the function
	const getRandomInt = max => {
		return Math.floor(Math.random() * max);
	};

	let anyRepeats = false;

	// Only run if more than one group in array
	if (groupsArray.length > 1) {
		// maxLoops is an arbitray number for a reasonable number of times to try to find no repeats
		const maxLoops = 500;

		for (let i = 0; i < maxLoops; ++i) {
			anyRepeats = false;
			groupsArray.forEach((group, index) => {
				groupToString(group);
				if (pastCombinations.hasOwnProperty(groupToString(group))) {
					// If past objects contains key with combination
					// swap random element of group with one from a random element from another group then sort them
					anyRepeats = true;
					// console.log('found repeat:');
					// console.log(group);
					const tempID = group.splice(getRandomInt(group.length), 1)[0];
					let otherIndex = index;
					while (otherIndex == index) {
						otherIndex = getRandomInt(groupsArray.length);
					}
					const otherGroup = groupsArray[otherIndex];
					const tempID2 = otherGroup.splice(
						getRandomInt(otherGroup.length),
						1
					)[0];
					group.push(tempID2);
					otherGroup.push(tempID);
					group.sort();
					otherGroup.sort();
				}
			});

			// If no repeats found, break out of loop and return the groups
			if (!anyRepeats) {
				break;
			}
		}
	}

	if (anyRepeats) {
		// console.log('There are repeats in these groups');
	}

	return {
		repeats: anyRepeats,
		groups: groupsArray,
		names: names
	};
};

// Convert array to comma separated string representation (I like this format better than JSON.stringify)
const groupToString = groupArray => {
	let groupString = '';
	groupArray.forEach((item, index) => {
		groupString += item;
		if (index != groupArray.length - 1) {
			groupString += ',';
		}
	});
	// console.log(groupString);
	return groupString;
};

module.exports = squad;
