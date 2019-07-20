const config = require('./../config.json');

class clanMemberHandler {

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

		if (member.roles.has(roleStages['newbie'].id)) {
			if(isClanMember) {
				// If it has the role of newbie and it's a member of any clan:
				// remove the newbie role and add the member role
				member.removeRole(roleStages['newbie'].id);
				member.addRole(roleStages['member'].id);
				channel.send(member.displayName + ' has `' + roleStages['newbie'].name + '` role but is part of the clan, changed his role to `' + roleStages['member'].name + '`');
			}
			else {
				// If it is not a member, add invite role
				member.removeRole(roleStages['newbie'].id);
				member.addRole(roleStages['invite'].id);
				channel.send(member.displayName + ' has `' + roleStages['newbie'].name + '` role but is NOT part of the clan, changed his role to `' + roleStages['invite'].name + '`');
			}
		}

		if (member.roles.has(roleStages['invite'].id) && isClanMember) {
			// If it has the role of an 'invite' and it's a member of any clan:
			// remove the 'invite' role and add the member role
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

module.exports = clanMemberHandler;