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
		const clan = new DestinyClan(process.env.BUNGIE_CLAN_ID);
		const secondClan = new DestinyClan(process.env.BUNGIE_2ND_CLAN_ID);
		const roleStages = this.getRoleStages(message.guild.roles);
		clan.getMembers((err) => {
			message.channel.send('An error occurred when querying Bungie Clan Data!');
			console.log(err);
		},
		(clanMembers) => {
			// get the second clan members
			secondClan.getMembers((err) => {
				message.channel.send('An error occurred when querying Bungie Clan Data!');
				console.log(err);
			},
			(secondClanMembers) => {
				message.guild.members.forEach(member => {
					if(!member.user.bot) {
						let memberName = member.displayName;
						if (member.nickname != undefined) {
							memberName = member.nickname.split('#')[0];
						}
						memberName = memberName.toLowerCase().trim();
						const isClanMember = memberName in clanMembers;
						const isSecondClanMember = memberName in secondClanMembers;
						this.validateClanMemberRoles(member, isClanMember, isSecondClanMember, roleStages, message.channel);
					}
				});
				message.channel.send('Finished updating member roles.');
			});
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

	validateClanMemberRoles(member, isClanMember, isSecondClanMember, roleStages, channel) {
		const isInAnyClan = isClanMember || isSecondClanMember;
		if (!isInAnyClan && member.roles.has(roleStages['member'].id)) {
			// is not in any clan and has the discord role for 'member'
			// remove 'member' role and add 'leaver' role
			member.removeRole(roleStages['member'].id).then(console.log).catch(console.error);
			member.addRole(roleStages['leaver'].id).then(console.log).catch(console.error);
			channel.send(member.displayName + ' leaved the clan!, changed his role to `' + roleStages['leaver'].name + '`');
		}
		
		if (member.roles.has(roleStages['newbie'].id) && isInAnyClan) {
			// If it has the role of newbie and it's a member of any clan:
			// remove the newbie role and add the member role
			member.removeRole(roleStages['newbie'].id).then(console.log).catch(console.error);
			member.addRole(roleStages['member'].id).then(console.log).catch(console.error);
			channel.send(member.displayName + ' has `' + roleStages['newbie'].name + '` role but is part of the clan, changed his role to `' + roleStages['member'].name + '`');
		}

		if (member.roles.has(roleStages['leaver'].id) && isInAnyClan) {
			// If it has the role of a leaver and it's a member of any clan:
			// remove the leaver role and add the member role
			member.removeRole(roleStages['leaver'].id).then(console.log).catch(console.error);
			member.addRole(roleStages['member'].id).then(console.log).catch(console.error);
			channel.send(member.displayName + ' has `' + roleStages['leaver'].name + '` role but is part of the clan, changed his role to `' + roleStages['member'].name + '`');
		}

		if (!member.roles.has(roleStages['k3k'].id) && isClanMember) {
			// If it doesn't have the role of k3k clan and is a clan member
			// remove the other clan role and add this clan role
			member.removeRole(roleStages['k4k'].id).then(console.log).catch(console.error);
			member.addRole(roleStages['k3k'].id).then(console.log).catch(console.error);
			channel.send(member.displayName + ' was added to clan role `' + roleStages['k3k'].name + '`');
		}

		if (!member.roles.has(roleStages['k4k'].id) && isSecondClanMember) {
			// If it doesn't have the role of k3k clan and is a clan member
			// remove the other clan role and add this clan role
			member.removeRole(roleStages['k3k'].id).then(console.log).catch(console.error);
			member.addRole(roleStages['k4k'].id).then(console.log).catch(console.error);
			channel.send(member.displayName + ' was added to clan role `' + roleStages['k4k'].name + '`');
		}
	}
}