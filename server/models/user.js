// schema for user
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// set up a mongoose model
var UserSchema = new Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        default: 'bhattacharyasaptarshi2001@gmail.com',
    },
    password: String
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        done(err, isMatch);
    }
    );
}

// return the model
module.exports = mongoose.model('User', UserSchema);
