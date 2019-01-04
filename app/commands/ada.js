const Vendors = require('../helpers/vendors');

module.exports = {
	name: 'ada',
	aliases: ['blackarmory', 'forge', 'forja'],
	description: 'Get Ada-1\'s inventory.',
	execute(message, args) {
		const handler = new AdaCommandHandler();
		handler.processMessage(message, args);
	},
	adminOnly: false,
};

class AdaCommandHandler {
	processMessage(message) {
		try {
			const vendors = new Vendors();
			vendors.getAdasInventory((err) => {
				message.channel.send('An error occurred when querying vendors data!');
				console.log(err);
			},  (adasInventory)=> {
				try {
					message.channel.send(this.getAdasInventoryMessage(adasInventory), { split: true });
				} catch (error) {
					console.log(error)
				}
			});
		} catch (error) {
			console.log(error);
		}
	}

	getAdasInventoryMessage(adasInventory) {
		// if we don't get any data, return an error message
		if (adasInventory == undefined) {
			return 'Ada-1\'s inventory data not available!';
		}

		let message = '**Ada-1**:\n';
		// append armor info
		adasInventory.forEach(element => {
			message += `\t${element}\n`;
		});
		return message;
	}
}

