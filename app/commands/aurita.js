const Vendors = require('../helpers/vendors');

module.exports = {
    name: 'aurita',
    description: '',
	execute(message, args) {
		const handler = new XurCommandHandler();
		handler.processMessage(message, args);
	},
	adminOnly: false,
};

class XurCommandHandler {
	processMessage(message) {
		message.channel.send(`No, **Ahorita** no joven!`, { split: true });
	}
}
