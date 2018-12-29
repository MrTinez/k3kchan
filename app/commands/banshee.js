const Vendors = require('../helpers/vendors');

module.exports = {
	name: 'banshee',
	aliases: ['armero'],
	description: 'Gets Banshee\'s inventory.',
	execute(message, args) {
		const handler = new BansheeCommandHandler();
		handler.processMessage(message, args);
	},
	adminOnly: false,
};

class BansheeCommandHandler {
	processMessage(message) {
		const vendors = new Vendors();

		vendors.getBansheesInventory((err) => {
			message.channel.send('An error occurred when querying vendors data!');
			console.log(err);
		},
		(bansheeInventory) => {
			message.channel.send(this.getBansheeInventoryMessage(bansheeInventory), { split: true });
		});
	}

	getBansheeInventoryMessage(bansheeInventory) {
		// if we don't get any data, return an error message
		if(bansheeInventory == undefined) {
			return 'Banshee\'s inventory data not available!';
		}

		let message = '**Banshee**:\n';

		// append armor info
		bansheeInventory.forEach(element => {
			message += `\t**${element.name}** - ${element.desc}\n`;
		});

		return message;
	}
}

