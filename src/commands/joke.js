/*
 * right now it's using the below link, I may have it randomly choose another link as well?
 *https://jokes.one/api/joke/#js
 */
const axios = require('axios');

module.exports = {
	name: 'joke',
    description: 'Send a silly joke!',
    aliases: ['jest'],
    execute(message) {
        // grab a joke from this api
        axios.get('https://sv443.net/jokeapi/v2/joke/Miscellaneous,Dark,Pun?blacklistFlags=nsfw,religious,political,racist,sexist')
          .then(response => {
            //follow the setup/delivery or joke json structure depending on what is received
            if ("delivery" in response.data) {
                let res = response.data.setup.concat('\n', response.data.delivery);
                message.channel.send(res);
            }
            else {
                message.channel.send(response.data.joke);
            }
        })
        .catch(error => {
          console.log(error);
          return message.channel.send(`I am unable to pity the fool, sorry master ${message.author}`);
        }); 
    }
};
