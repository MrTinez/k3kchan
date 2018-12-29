const Vendors = require('../helpers/vendors');

module.exports = {
	name: 'nightfalls',
	aliases: ['nightfall', 'ocaso', 'ocasos'],
	description: 'Get active nightfalls for this week.',
	execute(message, args) {
		const handler = new NightfallCommandHandler();
		handler.processMessage(message, args);
	},
	adminOnly: false,
};

class NightfallCommandHandler {
	processMessage(message) {
		const vendors = new Vendors();

		vendors.getActiveNightfalls((err) => {
			message.channel.send('An error occurred when querying vendors data!');
			console.log(err);
		},
		(activeNightfalls) => {
			message.channel.send(this.getActiveNightfallsMessage(activeNightfalls), { split: true });
		});
	}

	getActiveNightfallsMessage(activeNightfalls) {
		// if we don't get any data, return an error message
		if(activeNightfalls == undefined) {
			return 'Nightfalls data not available!';
		}

		let message = '**Nightfalls**:\n';

		// append armor info
		activeNightfalls.forEach(element => {
			message += `\t${element.toString()}\n`;
		});

		return message;
	}
}

