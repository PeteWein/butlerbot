/**
 * @constructor
 * @author PeteWein
 * @version 1.0.0
 * @copyright MIT License (c) 2021
 */
// grab our dependencies/configs/token
const fs = require('fs');
const Discord = require('discord.js');
const winston = require('winston');
const { prefix, logLevel } = require('../config.json');
require('dotenv').config();

// create a new Discord objects
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

// read our commands and set them up
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

//the request response loop
client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	}
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) {
		return;
	}
	// prevent running commands inside of DMs
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	// if a command requires args, ensure they are there
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	// prevent spam logic
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
	
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	/* 
	 * The main execution of the commands themselves. The major flow is:
	 * 1. Try to execute the command under the standard flow
	 * 2. If it can't include the client object and try again
	 * 3. If it can't do either, write the error to console and tell the user there was an error
	 */ 
	try {
		command.execute(message, args);
		//NOTE: reaction ID is linked to the staging server
		message.react('742372849179820033');
	} catch (error) {
		if (error.message === 'Cannot read property \'cache\' of undefined') {
			command.execute(client, message, args);
			//NOTE: reaction ID is linked to the staging server
			message.react('742372849179820033');
		} else {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	}
});

// generic error handling
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

// set game status to help command
client.on("ready", () =>{
	client.user.setActivity(`${prefix}help`,
	{ type: 'LISTENING' })
	.catch(console.error);
});

// create our logging objects and levels
const logger = winston.createLogger({
	level: `${logLevel}`,
	transports: [
		new winston.transports.Console()
	],
	format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});

client.on('ready', () => logger.log('info', 'The bot is online!'));
client.on('debug', m => logger.log('debug', m));
client.on('warn', m => logger.log('warn', m));
client.on('error', m => logger.log('error', m));
process.on('uncaughtException', error => logger.log('error', error));


// login to Discord with your app's token and begin running
client.login(process.env.BOT_TOKEN);
