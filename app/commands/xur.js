const Vendors = require('../helpers/vendors');

module.exports = {
	name: 'xur',
	aliases: ['xul'],
	description: 'Gets Xur\'s inventory.',
	execute(message, args) {
		const handler = new XurCommandHandler();
		handler.processMessage(message, args);
	},
	adminOnly: false,
};

class XurCommandHandler {
	processMessage(message) {
		const vendors = new Vendors();

		vendors.getXurInventory((err) => {
			message.channel.send('An error occurred when querying vendors data!');
			console.log(err);
		},
		(xurInventory) => {
			message.channel.send(this.getXurInventoryMessage(xurInventory), { split: true });
		});

		vendors.getXurLocation((err) => {
			message.channel.send('An error occurred when querying vendors data!');
			console.log(err);
		},
		(xurLocation) => {
			message.channel.send(`Xur is in ${xurLocation}`, { split: true });
		});
	}

	getXurInventoryMessage(xurInventory) {
		// if we don't get any data, return an error message
		if(xurInventory == undefined || xurInventory.xurweapon == undefined || xurInventory.xurweapon == undefined) {
			return 'Xur data not available!';
		}

		let message = '';

		// append weapon info
		message += `Weapon: **${xurInventory.xurweapon}**\n`;

		// append armor info
		xurInventory.xurarmor.forEach(element => {
			message += `**${element.class}**: **${element.name}**\n`;
			message += '\tPerks:\t';
			element.perks.forEach(perk => {
				message += `${perk.name}, `;
			});
			message += '\n';
		});

		return message;
	}
}

