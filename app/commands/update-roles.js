const clanMemberHandler = require('../helpers/clanMembers');

module.exports = {
	name: 'update-roles',
	description: 'Updates the roles of every member of the discord server based on their status with the Bungie clan.',
	execute(message, args) {
		const handler = new clanMemberHandler();
		handler.processMessage(message, args);
	},
	adminOnly: true,
};
