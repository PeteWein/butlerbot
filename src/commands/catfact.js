/**
 * Have butlerbot get a random cat fact from the internet.
 * @module catfact
 * @return {Object} - string (as a message to discord text channel)
 */
const axios = require('axios');
module.exports = {
  name: 'catfact',
  description: 'Get a random cat fact.',
  aliases: ['catfacts'],
  /**
   * @method execute
   * @param {string} message - command, used to determine which channel to return results
   * @return {string} results of cat fact api call 
   */  
  execute(message) {    
    /** 
     * @var {string} catFactApi
     * @summary cat fact api url
     */         
    let catFactApi = 'https://cat-fact.herokuapp.com/facts/random';
    /** 
     * @function catFactApiCall
     * @async
     * @param {string} api - cat fact api url
     * @return {Object} response
     * @summary web location to perform api call against for cat image
     */     
    function catFactApiCall(api) {
      axios.get(api)
      .then(response => {
        message.channel.send(response.data.text);
      })
      .catch(error => {
        console.log(error);
        return message.channel.send(`I'm unable to find any interesting cat facts at this time, sorry master ${message.author}`);
      }); 
    }
    catFactApiCall(catFactApi);
  }
};
