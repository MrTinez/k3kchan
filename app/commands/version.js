const config = require('./../config.json');

module.exports = {
	name: 'version',
	description: 'Display info about this bot.',
	execute(message) {
		message.channel.send(`Bot version: ${config.version}`);
	},
};
