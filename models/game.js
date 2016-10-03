module.exports = function(mongoose) {
	var gameSchema = mongoose.Schema({
		playersNumber: Number,
		description: String
	});

	return mongoose.model('Game', gameSchema);
}