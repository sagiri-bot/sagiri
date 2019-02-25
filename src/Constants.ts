
export enum DiscordEvent {
	// Shard events
	SHARD_READY = 'shardReady',
	SHARD_RESUME = 'shardResume',
	SHARD_DISCONNECT = 'shardDisconnect',

	// Guild events
	GUILD_CREATE = 'guildCreate',
	GUILD_DELETE = 'guildDelete',
	GUILD_UPDATE = 'guildUpdate',

	// Voice events
	VOICE_STATE_UPDATE = 'voiceStateUpdate',
	VOICE_SERVER_UPDATE = 'voiceServerUpdate',

	// Message events
	MESSAGE_CREATE = 'messageCreate',

	READY = 'ready',
	rawWS = 'rawWS'
}
