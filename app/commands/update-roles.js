const config = require('./../config.json');
const DestinyClan = require('../helpers/destinyClan');

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
			const roleStages = this.getRoleStages(message.guild.roles);
			clan.getMembers((err)=> {
				message.channel.send('An error occurred when querying Bungie Clan Data!');
				console.error(err);
			}, (clanMembers)=> {
				try {
					message.guild.members.forEach(member => {
						if (!member.user.bot) {
							let memberName = member.displayName;
							if (member.nickname != undefined) {
								memberName = member.nickname.split('#')[0];
							}
							memberName = memberName.toLowerCase().trim();
							const isClanMember = memberName in clanMembers;
							this.validateClanMemberRoles(member, isClanMember, roleStages, message.channel);
						}
					});
					message.channel.send('Finished updating member roles.');
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

	getRoleStages(roles) {
		const rolStages = {};
		for (const key in config.roleNames) {
			const guildRole = roles.find(x => x.name == config.roleNames[key]);
			rolStages[key] = { id: guildRole.id, name: guildRole.name };
		}
		return rolStages;
	}

	validateClanMemberRoles(member, isClanMember, roleStages, channel) {
		if (!isClanMember && member.roles.has(roleStages['member'].id)) {
			// is not in any clan and has the discord role for 'member'
			// remove 'member' role and add 'invite' role
			member.removeRole(roleStages['member'].id);
			member.addRole(roleStages['invite'].id);
			channel.send(member.displayName + ' left the clan!, changed his role to `' + roleStages['invite'].name + '`');
		}

		if (member.roles.has(roleStages['newbie'].id) && isClanMember) {
			// If it has the role of newbie and it's a member of any clan:
			// remove the newbie role and add the member role
			member.removeRole(roleStages['newbie'].id);
			member.addRole(roleStages['member'].id);
			channel.send(member.displayName + ' has `' + roleStages['newbie'].name + '` role but is part of the clan, changed his role to `' + roleStages['member'].name + '`');
		}
		else {
			//If it is not a member, add invite role
			member.removeRole(roleStages['newbie'].id);
			member.addRole(roleStages['invite'].id);
			channel.send(member.displayName + ' has `' + roleStages['newbie'].name + '` role but is NOT part of the clan, changed his role to `' + roleStages['invite'].name + '`');
		}

		if (member.roles.has(roleStages['invite'].id) && isClanMember) {
			// If it has the role of a leaver and it's a member of any clan:
			// remove the leaver role and add the member role
			member.removeRole(roleStages['invite'].id);
			member.addRole(roleStages['member'].id);
			channel.send(member.displayName + ' has `' + roleStages['invite'].name + '` role but is part of the clan, changed his role to `' + roleStages['member'].name + '`');
		}

		
		if (!member.roles.has(roleStages['k3k'].id) && isClanMember) {
			// If it doesn't have the role of k3k clan and is a clan member
			// remove the other clan role and add this clan role
			member.addRole(roleStages['k3k'].id);
			channel.send(member.displayName + ' was added to clan role `' + roleStages['k3k'].name + '`');
		}
	}
}
