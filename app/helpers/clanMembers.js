const config = require('./../config.json');
const DestinyClan = require('./destinyClan');

class clanMemberHandler {

	processMember(member) {
		try {
			const clan = new DestinyClan(process.env.BUNGIE_CLAN_ID);
			const roleStages = this.getRoleStages(member.guild.roles);
			clan.getMembers((err)=> {
				console.error(err);
			}, (clanMembers)=> {
				try {
					if (!member.user.bot) {
						let memberName = member.displayName;
						if (member.nickname != undefined) {
							memberName = member.nickname.split('#')[0];
						}
						memberName = memberName.toLowerCase().trim();
						const isClanMember = memberName in clanMembers;
						const channel = member.guild.channels.find(ch => ch.name === 'admin-bots');
						this.validateClanMemberRoles(member, isClanMember, roleStages, channel);
					}
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

	processMessage(message) {
		try {
			const clan = new DestinyClan(process.env.BUNGIE_CLAN_ID);
			const roleStages = this.getRoleStages(message.guild.roles);
			const data = [];
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
							const clanData = clanMembers[memberName];
							const isClanMember = clanData != undefined;
							const memberType = clanData == undefined ? -1 : clanData.memberType;
							discordMembers[memberName] = true;
							this.validateClanMemberRoles(member, isClanMember, roleStages, message.channel, memberType);
						}
					});
					message.channel.send('Finished updating member roles.');
					message.channel.send('Checking for bungie members not in discord...');
					for (const bungieMember in clanMembers) {
						if (!(bungieMember in discordMembers)) {
							data.push(bungieMember + ' is part of bungie clan but is not in the discord server \n');
						}
					}
					message.author.send(data, { split: true })
						.then(() => {
							if (message.channel.type === 'dm') return;
							message.reply('I\'ve sent you a DM with the members missing in the server!');
						})
						.catch(error => {
							console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
							message.reply('it seems like I can\'t DM you!');
						});
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

	getRoleStages(roles) {
		const rolStages = {};
		for (const key in config.roleNames) {
			const guildRole = roles.find(x => x.name == config.roleNames[key]);
			rolStages[key] = { id: guildRole.id, name: guildRole.name };
		}
		return rolStages;
	}

	validateClanMemberRoles(member, isClanMember, roleStages, channel, memberType) {
		if (member.displayName == 'Garo') {
			console.log(member, isClanMember, roleStages, channel, memberType);
		}
		if (!isClanMember && member.roles.has(roleStages['member'].id)) {
			// is not in any clan and has the discord role for 'member'
			// remove 'member' role and add 'invite' role
			member.removeRole(roleStages['member'].id);
			member.addRole(roleStages['invite'].id);
			channel.send(member.displayName + ' left the clan!, changed his role to `' + roleStages['invite'].name + '`');
		}

		if (member.roles.has(roleStages['invite'].id) && isClanMember) {
			// If it has the role of an 'invite' and it's a member of any clan:
			// remove the 'invite' role and add the member role
			member.removeRole(roleStages['invite'].id);
			member.addRole(roleStages['member'].id);
			channel.send(member.displayName + ' has `' + roleStages['invite'].name + '` role but is part of the clan, changed his role to `' + roleStages['member'].name + '`');
		}

		if(memberType != config.beginnersBungieClanMemberType) {
			// member is not a beginner, make sure he doesn't have that role
			if (member.roles.has(roleStages['beginner'].id)) {
				member.removeRole(roleStages['beginner'].id);
				channel.send(member.displayName + ' has `' + roleStages['beginner'].name + '` role but is not a Clan Beginner. Role removed.');
			}
		}
		else if(!member.roles.has(roleStages['beginner'].id)) {
			// if the member is a beginner, and does not have the role, assign it to him
			member.addRole(roleStages['beginner'].id);
			channel.send(member.displayName + ' is a clan Beginner, assigning Role `' + roleStages['beginner'].name + '`');
		}
	}
}

module.exports = clanMemberHandler;