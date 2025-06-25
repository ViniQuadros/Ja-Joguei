const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
})

const User = mongoose.model('User', UserSchema);

module.exports = User;