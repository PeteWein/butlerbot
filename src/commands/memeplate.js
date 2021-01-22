const axios = require('axios');

module.exports = {
    name: 'memeplate',
    description: 'Get a random meme template from imgflip!',
    execute(client, message) { 
        message.channel.startTyping();
        axios.get('https://api.imgflip.com/get_memes')
          .then(response => {
            var res = response.data.data.memes[Math.floor(Math.random() * response.data.data.memes.length)];
            message.channel.send(res.url);
          })
          .then(() => message.channel.stopTyping())
          .catch(error => {
            console.log(error);
            return message.channel.send(`I'm unable to grab a meme, sorry master ${message.author}`);
          }); 

    }
};
