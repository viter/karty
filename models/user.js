module.exports = function(mongoose) {
	var userSchema = mongoose.Schema({
		name: String,
		email: String,
		pass: String
	});

	userSchema.methods.validPassword = function(password) {
		console.log('user', this.pass);
		if(this.pass == password) {
			return true;
		}
		else {
			return false;
		}
	}
	/*
	return {
		User: mongoose.model('User', userSchema)
	}
	*/

	return mongoose.model('User', userSchema);
}