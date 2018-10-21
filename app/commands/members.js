const request = require('request');
const moment = require('moment');
const config = require('./../config.json');

const MAX_MESSAGE_STRING = 2000;
const DATE_FORMAT = 'DD/MM/YYYY';

module.exports = {
	name: 'members',
	description: 'Display members of this server and their status within the destiny clan.',
	execute(message, args) {
		const handler = new MemberCommandHandler();
		handler.processMessage(message, args);
	},
};

class MemberCommandHandler {
	processMessage(message, args) {
		const inCsv = args.length > 0 && args[0] == 'csv';
		const clan = new DestinyClan();
		const roleStages = this.getRoleStages(message.guild.roles);
		clan.getMembers((err) => {
			message.channel.send('An error occurred when querying Bungie Clan Data!');
			console.log(err);
		},
		(clanMembers) => {
			const header = 'Member, [Roles], Joined Server Date, Joined Clan Date\n';
			let buffer = '';
			buffer += `Listing members of ${message.guild.name}:\n`;
			buffer += header;
			message.guild.members.forEach(member => {
				if(!member.user.bot) {
					let memberName = member.displayName;
					if (member.nickname != undefined) {
						memberName = member.nickname.split('#')[0];
					}
					let isClanMember = false;
					let clanMemberSince = undefined;
					if (memberName in clanMembers) {
						isClanMember = true;
						clanMemberSince = clanMembers[memberName];
					}
					clan.validateClanMemberRoles(member, isClanMember, roleStages);
					const responseString = this.getMemberResponseString(member, isClanMember, clanMemberSince, inCsv);
					if(buffer.length + responseString.length > MAX_MESSAGE_STRING) {
						message.channel.send(buffer);
						buffer += responseString;
					}
					else {
						buffer += responseString;
					}
				}
			});
			if(buffer.length > 0) {
				message.channel.send(buffer);
			}
		});
	}

	getMemberResponseString(member, isClanMember, clanMemberSince, inCsv) {
		let responseString = member.toString();
		const roles = [];
		member.roles.forEach(role => {
			if(role.name != '@everyone') {
				roles.push(role.name);
			}
		});
		if(inCsv) {
			responseString += `, [${roles.join(' - ')}]`;
			responseString += `, ${moment(member.joinedAt).format(DATE_FORMAT)}`;
		}
		else{
			responseString += `\t-\t Roles: [${roles.join(' - ')}]`;
			responseString += `\t-\t Joined Server: ${moment(member.joinedAt).format(DATE_FORMAT)}`;
		}
		if (isClanMember) {
			if(inCsv) {
				responseString += `, ${clanMemberSince.format(DATE_FORMAT)}\n`;
			}
			else{
				responseString += `\t-\t Joined Clan: ${clanMemberSince.format(DATE_FORMAT)}\n`;
			}
		}
		else{
			responseString += ',\t Not a clan member!\n';
		}
		return responseString;
	}

	getRoleStages(roles) {
		const rolStages = {};
		for (const key in config.roleNames) {
			const guildRole = roles.find(x => x.name == config.roleNames[key]);
			rolStages[key] = guildRole.id;
		}
		return rolStages;
	}

}

class DestinyClan {
	constructor() {
		this.clanId = process.env.BUNGIE_CLAN_ID;
		this.bungieApiKey = process.env.BUNGIE_API_KEY;
	}

	getMembers(errorCallback, callback) {
		const uri = `https://www.bungie.net/Platform/GroupV2/${this.clanId}/Members/`;
		request({
			headers: {
				'X-API-Key': this.bungieApiKey,
			},
			json: true,
			uri: uri,
		}, function(err, res, body) {
			if(err) {
				console.log(err);
				errorCallback(err);
			}
			else{
				const members = {};
				body.Response.results.forEach(item => {
					members[item.destinyUserInfo.displayName] = moment(item.joinDate);
				});
				callback(members);
			}
		});
	}

	validateClanMemberRoles(member, isClanMember, roleStages) {
		if (member.roles.has(roleStages['member'])) {
			if (!isClanMember) {
				// is not a clan member and has the discord role for 'member'
				// remove 'member' role and add 'leaver' role
				member.removeRole(roleStages['member']).then(console.log).catch(console.error);
				member.addRole(roleStages['leaver']).then(console.log).catch(console.error);
			}
		}
		else if (member.roles.has(roleStages['newbie']) && isClanMember) {
			// Is a 'newbie' and is already a clan member, so add 'member' role and remove the 'newbie'
			member.removeRole(roleStages['newbie']).then(console.log).catch(console.error);
			member.addRole(roleStages['member']).then(console.log).catch(console.error);
		}
	}
}
