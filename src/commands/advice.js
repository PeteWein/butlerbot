const axios = require('axios');

// This one was actually a little annoying
module.exports = {
  name: 'advice',
  description: 'Ask for butlerbot\'s advice on a question.',
  aliases: ['advise'],
  execute(client, message) {      
    axios.get('https://api.adviceslip.com/advice')
    .then(response => {
      message.channel.send(response.data.slip.advice);
    })
    .catch(error => {
      console.log(error);
      return message.channel.send(`I do not think I can help you with this, sorry ${message.author}`);
    }); 
  }
};
