/**
 * Have butlerbot insult another member of the discord channel on your behalf.
 * @module insult
 * @return {Object} - string (as a message to discord text channel)
 */
const axios = require('axios');
module.exports = {
	name: 'insult',
    description: 'Insult your target.',
    aliases: ['burn'],
    usage: '@recipient',
    args: true,
    cooldown: 1,
    /**
     * @method execute
     * @param {string} message - command, used to determine which channel to return results
     * @param {string} args - recipient of insult message sent to channel; required
     * @return {string} selected insult with correct formatting and recipient
     */  
    execute(message,args) {   
      /** @var {string} insultApi */  
      let insultApi = 'https://evilinsult.com/generate_insult.php?lang=en&type=json';

      /** 
       * @function getApology
       * @async
       * @return {Object} insult
       * @summary selection of random insult from api call
       */       
      function insultMessage(api) {
        // to make it look like butlerbot is thinking about it
        message.channel.startTyping();
        // grab an insult from this api
        axios.get(api)
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
      // grab the insult and return the results
      insultMessage(insultApi);
    }
};
