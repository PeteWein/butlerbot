/**
 * Have butlerbot get a random dog image from the internet.
 * @module dog
 * @return {Object} - string (as a message to discord text channel)
 */
const axios = require('axios');
module.exports = {
  name: 'dog',
  description: 'Get a random dog!',
  /**
   * @method execute
   * @param {string} message - command, used to determine which channel to return results
   * @return {string} results of dog api call 
   */  
  execute(message) {   
    /** 
     * @var {string} dogApi
     * @summary dog image api url
     */         
    let dogApi = 'https://dog.ceo/api/breeds/image/random';

    /** 
     * @function dogApiCall
     * @async
     * @param {string} api - dog image api url
     * @return {Object} response
     * @summary perform api call against provided url for advice
     */   
    function dogApiCall(api) {
      axios.get(api)
      .then(response => {
        message.channel.send(response.data.message);
      })
      .catch(error => {
        console.log(error);
        return message.channel.send(`I'm unable to grab a dog, sorry master ${message.author}`);
      });   
    }
    // call the dog image api
    dogApiCall(dogApi);
  }
};
