const Mongoose = require('mongoose');

let UserSchema = new Mongoose.Schema({
    userID: { type: Number },
    userName: { type: String },
    userDisc: { type: String },
    description: { type: String, default: 'Welcome to my profile' },
    xp: { type: Number, default: 0 },
    blacklist: { type: Boolean, default: false }
});

module.exports = Mongoose.model('Users', UserSchema);
