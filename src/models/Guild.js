const Mongoose = require('mongoose');

let GuildSchema = new Mongoose.Schema({
    serverName: { type: String },
    serverID: { type: Number, unique: true },
    welcome: { channelID: { type: Number, default: '' }, message: { type: String, default: '' } },
    autoroleID: { type: String, default: '' },
    goodbye: { channelID: { type: String, default: '' }, message: { type: String, default: '' } },
    logChannel: { type: Number, default: '' },
    starChannel: { type: Number, default: '' },
    blacklist: { type: Boolean, default: false }
});

module.exports = Mongoose.model('Guilds', GuildSchema);
