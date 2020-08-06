const Discord = require('discord.js');

const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#9b30af')
	.setTitle('Butlerbot is happy to serve.')
	.setURL('https://imgflip.com/ai-meme')
	.setAuthor('Butlerbot', 'https://cdn0.iconfinder.com/data/icons/scrum-team/448/cloud_ops-512.png', 'https://github.com/PeteWein')
	.setDescription('A small bot designed to help with simple tasks.')
	.setThumbnail('https://funnynamesblog.files.wordpress.com/2015/04/butler-offer.jpg')
	.addFields(
		{name: 'Have questions?', value: 'Type !help', inline: true},
		{name: 'Want a meme?', value: 'Type !meme', inline: true}
	)
	.setImage('https://i.chzbgr.com/full/8385259776/h29253DB5/kitteh-butler-caters-to-feline-company')
	.setTimestamp()
	.setFooter('"But it better be honey on main" -Will', 'https://cdn0.iconfinder.com/data/icons/food-and-drinks-9/51/celebration2-512.png');

module.exports = {
    name: 'introduce',
	description: 'Introduces butlerbot with a fancy message!',
	aliases: ['present'],
    cooldown: 5,
    execute(message) {
		message.channel.send(exampleEmbed);
    }
};
