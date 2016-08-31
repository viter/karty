module.exports = function(mongoose) {
	var kittySchema = mongoose.Schema({
		name: String
	});

	return {
		Kitten: mongoose.model('Kitten', kittySchema)
	}
}