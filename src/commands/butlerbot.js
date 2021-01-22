const Discord = require('discord.js');

module.exports = {
    name: 'butlerbot',
	description: 'Introduces butlerbot with a fancy message!',
	aliases: ['whoareyou', 'whoareu', 'identify'],
    cooldown: 5,
    execute(client, message) {
		const exampleEmbed = new Discord.MessageEmbed()
		.setColor('#9b30af')
		.setTitle('Butlerbot is happy to serve.')
		.setURL('https://petewein.github.io/butlerbot/')
		.setAuthor('Butlerbot', 'https://cdn0.iconfinder.com/data/icons/scrum-team/448/cloud_ops-512.png', 'https://github.com/PeteWein')
		.setDescription('A small bot designed to help with simple tasks.')
		.setThumbnail('https://funnynamesblog.files.wordpress.com/2015/04/butler-offer.jpg')
		.addFields(
			{name: 'Have questions?', value: 'Type !help', inline: true},
			{name: 'Want a meme?', value: 'Type !meme', inline: true},
		)
		.setImage('https://i.chzbgr.com/full/8385259776/h29253DB5/kitteh-butler-caters-to-feline-company')
		.setTimestamp()
		.setFooter(`Happily performing my duties in ${client.guilds.cache.size} servers.`);
		message.channel.send(exampleEmbed);
    }
};
