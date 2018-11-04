const request = require('request');
const moment = require('moment');

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
					members[item.destinyUserInfo.displayName.toLowerCase().trim()] = moment(item.joinDate);
				});
				callback(members);
			}
		});
	}
}

module.exports = DestinyClan;
