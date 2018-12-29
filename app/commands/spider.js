const Vendors = require('../helpers/vendors');

module.exports = {
	name: 'spider',
	aliases: ['araña'],
	description: 'Get Spider\'s inventory.',
	execute(message, args) {
		const handler = new SpiderCommandHandler();
		handler.processMessage(message, args);
	},
	adminOnly: false,
};

class SpiderCommandHandler {
	processMessage(message) {
		const vendors = new Vendors();

		vendors.getSpidersInventory((err) => {
			message.channel.send('An error occurred when querying vendors data!');
			console.log(err);
		},
		(spidersInventory) => {
			message.channel.send(this.getSpidersInventoryMessage(spidersInventory), { split: true });
		});
	}

	getSpidersInventoryMessage(spidersInventory) {
		// if we don't get any data, return an error message
		if(spidersInventory == undefined) {
			return 'Spider\'s inventory data not available!';
		}

		let message = '**Spider**:\n';

		// append armor info
		spidersInventory.forEach(element => {
			message += `\t**${element.name}** for ${element.cost}\n`;
		});

		return message;
	}
}

