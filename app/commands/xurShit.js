const Vendors = require('../helpers/vendors');

module.exports = {
    name: 'sabro',
    aliases: ["xurtrajomierda", "xurmierda"],
	description: 'Respuesta sobre si Xur trajo mierda? Generalmente, se pregunta los viernes.',
	execute(message, args) {
		const handler = new XurCommandHandler();
		handler.processMessage(message, args);
	},
	adminOnly: false,
};

class XurCommandHandler {
	processMessage(message) {
		message.channel.send(`Si Sabro, Xur trajo pura mierda`, { split: true });
	}
}
