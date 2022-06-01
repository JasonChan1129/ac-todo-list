const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todoSchema = new Schema({
	name: {
		type: String,
		require: true,
	},
	isDone: {
		type: Boolean,
		default: false,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'Users',
		index: true,
		require: true,
	},
});

module.exports = mongoose.model('Todo', todoSchema);
