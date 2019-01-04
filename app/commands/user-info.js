module.exports = {
	name: 'user-info',
	description: 'Display info about yourself.',
	execute(message) {
		try {
			message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
		} catch (error) {
			console.log(error)
		}
	},
	adminOnly: false,
};
