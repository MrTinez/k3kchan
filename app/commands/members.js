const moment = require('moment');
const DestinyClan = require('./../helpers/destinyClan');

const MAX_MESSAGE_STRING = 2000;
const DATE_FORMAT = 'DD/MM/YYYY';

module.exports = {
	name: 'members',
	description: 'Display members of this server and their status within the destiny clan.',
	execute(message, args) {
		const handler = new MemberCommandHandler();
		handler.processMessage(message, args);
	},
	adminOnly: false,
};

class MemberCommandHandler {
	processMessage(message, args) {
		const inCsv = args.length > 0 && args[0] == 'csv';
		const clan = new DestinyClan();
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
					memberName = memberName.toLowerCase().trim();
					let isClanMember = false;
					let clanMemberSince = undefined;
					if (memberName in clanMembers) {
						isClanMember = true;
						clanMemberSince = clanMembers[memberName];
					}
					const responseString = this.getMemberResponseString(member, isClanMember, clanMemberSince, inCsv);
					if(buffer.length + responseString.length > MAX_MESSAGE_STRING) {
						message.channel.send(buffer);
						buffer = '';
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
		let responseString = member.displayName;
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
}