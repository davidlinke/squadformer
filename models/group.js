const mongoose = require('mongoose');

const squadSchema = mongoose.Schema({
	squadName: { type: String },
	names: { type: [Object] },
	pastGroups: { type: [Object] },
	pastCombinations: { type: Object }
});

const squad = mongoose.model('squad', squadSchema);

module.exports = squad;
