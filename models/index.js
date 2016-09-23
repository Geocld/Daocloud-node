var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BearSchema = new Schema({
	name: String
});

var UserSchema = new Schema({
	name: String,
	password: String,
	 admin: Boolean
});

module.exports.Bear = mongoose.model('Bear', BearSchema);
module.exports.User = mongoose.model('User', UserSchema);