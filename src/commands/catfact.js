const axios = require('axios');

// This one was actually a little annoying
module.exports = {
  name: 'catfact',
  description: 'Get a random cat fact.',
  aliases: ['catfacts'],
  execute(message) {      
    axios.get('https://cat-fact.herokuapp.com/facts/random')
    .then(response => {
      message.channel.send(response.data.text);
    })
    .catch(error => {
      console.log(error);
      return message.channel.send(`I'm unable to find any interesting cat facts at this time, sorry master ${message.author}`);
    }); 
  }
};
