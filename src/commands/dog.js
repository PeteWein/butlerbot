const axios = require('axios');

// This one was actually a little annoying
module.exports = {
  name: 'dog',
  description: 'Get a random dog!',
  execute(client, message) {      
    axios.get('https://dog.ceo/api/breeds/image/random')
    .then(response => {
      message.channel.send(response.data.message);
    })
    .catch(error => {
      console.log(error);
      return message.channel.send(`I'm unable to grab a dog, sorry master ${message.author}`);
    }); 
  }
};
