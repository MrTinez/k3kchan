const Vendors = require('../helpers/vendors');

module.exports = {
	name: 'xur',
	aliases: ['xul', 'xulo'],
	description: 'Gets Xur\'s inventory.',
	execute(message, args) {
		const handler = new XurCommandHandler();
		handler.processMessage(message, args);
	},
	adminOnly: false,
};

class XurCommandHandler {
	processMessage(message) {
		try {
			const vendors = new Vendors();
			vendors.getXurInventory((err) => {
				message.channel.send('An error occurred when querying vendors data!');
				console.log(err);
			}, (xurInventory) => {
				try {
					message.channel.send(this.getXurInventoryMessage(xurInventory), { split: true });
					if (xurInventory != undefined) {
						vendors.getXurLocation((err) => {
							try {
								message.channel.send('An error occurred when querying vendors data!');
								console.log(err);
							} catch (error) {
								console.log(error)
							}
						}, (xurLocation) => {
							try {
								message.channel.send(`Xur is in ${xurLocation}`, { split: true });
							} catch (error) {
								console.log(error)
							}
						});
					}
				} catch (error) {
					console.log(error)
				}
			});
		} catch (error) {
			console.log(error)
		}
	}

	getXurInventoryMessage(xurInventory) {
		// if we don't get any data, return an error message
		if (xurInventory == undefined || xurInventory.xurweapon == undefined || xurInventory.xurweapon == undefined) {
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

