const axios = require('axios');

module.exports = {
	name: 'burn',
    description: 'Insult your target.',
    aliases: ['insult'],
    usage: '@recipient',
    args: true,
    execute(message,args) {   
        // to make it look like butlerbot is thinking about it
        message.channel.startTyping();
        // grab an insult from this api
        axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json')
          .then(response => {
            // append our target to the insult
            message.channel.send(args[0].concat(', ', response.data.insult));
        })
        .then(() => message.channel.stopTyping())
        .catch(error => {
          console.log(error);
          return message.channel.send(`I am unable to pity the fool, sorry master ${message.author}`);
        }); 
    }
};
