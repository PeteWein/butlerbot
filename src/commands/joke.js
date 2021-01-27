/**
 * Ask butlerbot to tell a joke to the channel.
 * @module joke
 * @return {string} - joke (as a message to discord text channel)
 */
const axios = require('axios');
module.exports = {
	name: 'joke',
    description: 'Send a silly joke!',
    aliases: ['jest'],
    /**
     * @method execute
     * @param {string} message - command, used to determine which channel to return results
     * @return {string} results of advice api call 
     */      
    execute(message) {
        /** @var {string} jokeApi */
        let jokeApi = 'https://sv443.net/jokeapi/v2/joke/Miscellaneous,Dark,Pun?blacklistFlags=nsfw,religious,political,racist,sexist';
        /** 
         * @function jokeApiCall
         * @async
         * @param {string} joke - joke api url
         * @return {Object} response
         * @summary web location to perform api call against for joke
         */          
        function jokeApiCall(api) {
            axios.get(api)
            .then(response => {
              if ("delivery" in response.data) { // follow the setup/delivery or joke json structure depending on what is received
                  /** @var {string} res */                  
                  let res = response.data.setup.concat('\n', response.data.delivery);
                  message.channel.send(res);
              } else {
                  message.channel.send(response.data.joke);
              }
          })
          .catch(error => {
            console.log(error);
            return message.channel.send(`I am unable to pity the fool, sorry master ${message.author}`);
          }); 
        }
        jokeApiCall(jokeApi);
    }
};
