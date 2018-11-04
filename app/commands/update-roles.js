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
		const clan = new DestinyClan();
		const roleStages = this.getRoleStages(message.guild.roles);
		clan.getMembers((err) => {
			message.channel.send('An error occurred when querying Bungie Clan Data!');
			console.log(err);
		},
		(clanMembers) => {
			message.guild.members.forEach(member => {
				if(!member.user.bot) {
					let memberName = member.displayName;
					if (member.nickname != undefined) {
						memberName = member.nickname.split('#')[0];
					}
					const isClanMember = memberName in clanMembers;
					this.validateClanMemberRoles(member, isClanMember, roleStages, message.channel);
				}
			});
			message.channel.send('Finished updating member roles.');
		});
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
		if (member.roles.has(roleStages['member'].id)) {
			if (!isClanMember) {
				// is not a clan member and has the discord role for 'member'
				// remove 'member' role and add 'leaver' role
				member.removeRole(roleStages['member'].id).then(console.log).catch(console.error);
				member.addRole(roleStages['leaver'].id).then(console.log).catch(console.error);
				channel.send(member.displayName + ' leaved the clan!, changed his role to `' + roleStages['leaver'].name + '`');
			}
		}
		else if ((member.roles.has(roleStages['newbie'].id) || member.roles.has(roleStages['leaver'].id)) && isClanMember) {
			// Is a 'newbie' and is already a clan member, so add 'member' role and remove the 'newbie'
			member.removeRole(roleStages['newbie'].id).then(console.log).catch(console.error);
			member.addRole(roleStages['member'].id).then(console.log).catch(console.error);
			channel.send(member.displayName + ' is part of the clan, changed his role to `' + roleStages['member'].name + '`');
		}
	}
}