const axios = require('axios');

module.exports = {
	name: 'insult',
    description: 'Insult your target.',
    aliases: ['burn'],
    usage: '@recipient',
    args: true,
    cooldown: 1,
    execute(client, message,args) {   
        // to make it look like butlerbot is thinking about it
        message.channel.startTyping();
        // grab an insult from this api
        axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json')
          .then(response => {
            // append our target to the insult
            let res = response.data.insult.replace(/&quot;/g, '\\"').replace(/&amp;/g, '\\&\\').replace(/&gt;/g, '\\>\\');
            message.channel.send(args[0].concat(', ', res));
        })
        .then(() => message.channel.stopTyping())
        .catch(error => {
          console.log(error);
          return message.channel.send(`I am unable to pity the fool, sorry master ${message.author}`);
        }); 
    }
};
