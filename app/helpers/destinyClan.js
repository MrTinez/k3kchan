const request = require('request');
const moment = require('moment');

class DestinyClan {
	constructor(clanId) {
		this.clanId = clanId;
		this.bungieApiKey = process.env.BUNGIE_API_KEY;
	}

	getMembers(errorCallback, callback) {
		const uri = `https://www.bungie.net/Platform/GroupV2/${this.clanId}/Members/`;
		try {
			request({
				headers: {
					'X-API-Key': this.bungieApiKey,
				},
				json: true,
				uri: uri,
			}, (err, res, body)=> {
				if (err) {
					console.error(err);
					errorCallback(err);
				}
				else {
					const members = {};
					body.Response.results.forEach(item => {
						members[item.destinyUserInfo.displayName.toLowerCase().trim()] = {
							joinDate: moment(item.joinDate),
							memberType: item.memberType,
						};
					});
					callback(members);
				}
			});
		}
		catch (err) {
			console.error(err);
			errorCallback(err);
		}
	}
}

module.exports = DestinyClan;