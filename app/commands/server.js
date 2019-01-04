module.exports = {
	name: 'server',
	description: 'Display info about this server.',
	execute(message) {
		try {
			message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
		} catch (error) {
			console.log(error)
		}
	},
	adminOnly: false,
};
