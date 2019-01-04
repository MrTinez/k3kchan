const config = require('./../config.json');

module.exports = {
	name: 'version',
	description: 'Display info about this bot.',
	execute(message) {
		try {
			message.channel.send(`Bot version: ${config.version}`);
		} catch (error) {
			console.log(error)
		}
	},
	adminOnly: false,
};
