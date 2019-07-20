const DestinyClan = require('../helpers/destinyClan');
const clanMemberHandler = require('../helpers/clanMembers')

module.exports = {
	name: 'update-roles',
	description: 'Updates the roles of every member of the discord server based on their status with the Bungie clan.',
	execute(message, args) {
		const handler = new MemberCommandHandler();
		handler.processMessage(message, args);
	},
	adminOnly: true,
};

class MemberCommandHandler {
	processMessage(message) {
		try {
			const clan = new DestinyClan(process.env.BUNGIE_CLAN_ID);
			const memberHandler = new clanMemberHandler();
			const roleStages = memberHandler.getRoleStages(message.guild.roles);
			clan.getMembers((err)=> {
				message.channel.send('An error occurred when querying Bungie Clan Data!');
				console.error(err);
			}, (clanMembers)=> {
				try {
					const discordMembers = {};
					message.guild.members.forEach(member => {
						if (!member.user.bot) {
							let memberName = member.displayName;
							if (member.nickname != undefined) {
								memberName = member.nickname.split('#')[0];
							}
							memberName = memberName.toLowerCase().trim();
							const isClanMember = memberName in clanMembers;
							discordMembers[memberName] = true;
							memberHandler.validateClanMemberRoles(member, isClanMember, roleStages, message.channel);
						}
					});
					message.channel.send('Finished updating member roles.');
					message.channel.send('Checking for bungie members not in discord...');
					for (const bungieMember in clanMembers) {
						if (!(bungieMember in discordMembers)) {
							message.channel.send(bungieMember + ' is part of bungie clan but is not in the discord server');
						}
					}
					message.channel.send('Finished checking bungie members!');
				}
				catch (error) {
					console.error(error);
				}
			});
		}
		catch (error) {
			console.error(error);
		}
	}
}