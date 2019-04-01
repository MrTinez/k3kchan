module.exports = {
	name: 'server',
	description: 'Display info about this server.',
	execute(message) {
		try {
			message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
		}
		catch (error) {
			console.error(error);
		}
	},
	adminOnly: false,
};
