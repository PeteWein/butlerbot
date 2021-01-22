const axios = require('axios');

// This one was actually a little annoying
module.exports = {
  name: 'cat',
  description: 'Get a random cat!',
  aliases: ['catmeme'],
  execute(client, message) {      
    axios.get('https://api.thecatapi.com/v1/images/search')
    .then(response => {
      message.channel.send(response.data[0].url);
    })
    .catch(error => {
      console.log(error);
      return message.channel.send(`I'm unable to grab a cat, sorry master ${message.author}`);
    }); 
  }
};
