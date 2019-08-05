const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const groupSchema = mongoose.Schema({
// 	names: { type: [String] },
// 	history: { type: [Object] }
// });

const squadSchema = mongoose.Schema({
	squadName: { type: String },
	names: { type: [Object] },
	pastGroups: { type: [Object] },
	pastCombinations: { type: Object }
});

const squad = mongoose.model('squad', squadSchema);

module.exports = squad;

// const namesSchema = mongoose.Schema({
// 	name: { type: String },
// 	absent: { type: Boolean },
// 	archived: { type: Boolean }
// });
// const names = mongoose.model('names', namesSchema);

// const pastGroupCombinationSchema = mongoose.Schema({
// 	groupName: { type: String },
// 	personIDs: { type: [String] }
// });

// const pastGroupCombinations = mongoose.model(
// 	'pastGroupCombinations',
// 	pastGroupCombinationSchema
// );

// const pastGroupsSchema = mongoose.Schema({
// 	combinations: [{ type: Schema.Types.ObjectId, ref: 'pastGroupCombinations' }]
// });

// const pastGroups = mongoose.model('pastGroups', pastGroupsSchema);

// const groupSchema = mongoose.Schema({
// 	squadName: { type: String },
// 	names: [{ type: Schema.Types.ObjectId, ref: 'names' }],
// 	pastGroups: [{ type: Schema.Types.ObjectId, ref: 'pastGroups' }],
// 	allPastCombinations: { type: Object }
// });

// const group = mongoose.model('group', groupSchema);

// // module.exports = group;
// // module.exports = names;
// // module.exports = pastGroups;
// // module.exports = pastGroupCombinations;

// module.exports = {
// 	group: group,
// 	names: names,
// 	pastGroups: pastGroups,
// 	pastGroupCombinations: pastGroupCombinations
// };
