module.exports = function(mongoose) {
	var gameSchema = mongoose.Schema({
		playersNumber: Number,
		description: String,
		playersJoinedNumber: {type: Number, default: 0},
		players: Array
	});

	return mongoose.model('Game', gameSchema);
}