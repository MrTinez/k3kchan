// load .env variables
require('dotenv').config();

// load config and command files
const config = require('./config.json');
const prefix = config.prefix;
const fs = require('fs');
const commandFiles = fs.readdirSync('./app/commands').filter(file => file.endsWith('.js'));

// setup discord client
const Discord = require('discord.js');
const client = new Discord.Client();

// setup commands dynamically based on command files
client.commands = new Discord.Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Bot Ready - setup here anything after the bot is ready
client.on('ready', () => {
	console.log('Bot is ready! Waiting for commands...');
});

// on message, route it to the proper command
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

// start the bot
client.login(process.env.DISCORD_BOT_TOKEN);