const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
	names: { type: [String] },
	history: { type: [Object] }
});

const group = mongoose.model('Group', groupSchema);

module.exports = group;
