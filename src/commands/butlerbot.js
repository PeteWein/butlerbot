/**
 * Have butlerbot provide an embedded message with some funny information/helpful links.
 * @module butlerbot
 * @return {string} - embedded message to discord text channel
 */
const Discord = require('discord.js');
module.exports = {
    name: 'butlerbot',
	description: 'Introduces butlerbot with a fancy message!',
	aliases: ['whoareyou', 'whoareu', 'identify'],
	cooldown: 1,
	/**
	 * @method execute
	 * @param {string} client - discord bot object, allows us to include certain information about the bot itself
	 * @param {string} message - command, used to determine which channel to return results
	 * @return {string} embedded message
	 */  	
    execute(client, message) {
		// * Define default values being used for the embedded message
		/** @var {string} color */
		let color = '#9b30af';
		/** @var {string} title */
		let title = 'Butlerbot is happy to serve.';
		/** @var {string} url */
		let url = 'https://petewein.github.io/butlerbot/';
		/** @var {string[]} author */
		let author = [
			'Butlerbot', 
			'https://cdn0.iconfinder.com/data/icons/scrum-team/448/cloud_ops-512.png', 
			'https://github.com/PeteWein/butlerbot'
		];
		/** @var {string} description */
		let description = 'A small bot designed to help with simple tasks.';
		/** @var {string} thumbnail */
		let thumbnail = 'https://funnynamesblog.files.wordpress.com/2015/04/butler-offer.jpg';
		/** @var {string[]} addFields */
		let addFields = [
			{name: 'Have questions?', value: 'Type !help', inline: true},
			{name: 'Want a meme?', value: 'Type !meme', inline: true},
			{name: 'Looking for documentation?', value: '[Click here](https://petewein.github.io/butlerbot/documentation/index.html)', inline: true},
		];
		/** @var {string} image */
		let image = 'https://i.chzbgr.com/full/8385259776/h29253DB5/kitteh-butler-caters-to-feline-company';
		/** @var {integer} servers */
		let servers = client.guilds !== undefined ? client.guilds.cache.size : 0;
		/** @var {string} footer */
		let footer = `Happily performing my duties in ${servers} servers.`;

		/** 
		 * @function embedMessage
		 * @param {string} color - color hex code for background of embed image
		 * @param {string} title - title of the embedded message
		 * @param {string} url - link when title is clicked
		 * @param {string} author - embedded message author, author image, and link when author is clicked
		 * @param {string} description - text below title to described embedded message
		 * @param {string} thumbnail - thumbnail image
		 * @param {string} image - upper right corner image
		 * @param {string} footer - display at end of embedded message
		 * @return {Object} embed
		 * @summary create and generate the embedded message
		 */ 		
		function embedMessage(color, title, url, author, description, thumbnail, image, footer) {
			/**
			 * @const embed 
			 * @summary embedded message object
			 */
			const embed = new Discord.MessageEmbed()
			.setColor(color)
			.setTitle(title)
			.setURL(url)
			.setAuthor(author[0], author[1], author[2])
			.setDescription(description)
			.setThumbnail(thumbnail)
			.addFields(addFields)
			.setImage(image)
			.setFooter(footer)	
			.setTimestamp();
			return embed;
		}
		let butlerbotEmbed = embedMessage(color, title, url, author, description, thumbnail, image, footer);
		message.channel.send(butlerbotEmbed);
    }
};
