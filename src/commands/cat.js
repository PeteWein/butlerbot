/**
 * Have butlerbot get a random photo of a cat from the internet.
 * @module cat
 * @return {Object} - image (as a message to discord text channel)
 */
const axios = require('axios');
module.exports = {
  name: 'cat',
  description: 'Get a random cat!',
  aliases: ['catmeme'],
  /**
   * @method execute
   * @param {string} message - command, used to determine which channel to return results
   * @return {string} results of cat api call 
   */
  execute(message) {   
    /** 
     * @var {string} catApi
     * @summary cat image api url
     */     
    let catApi = 'https://api.thecatapi.com/v1/images/search';   
    /** 
     * @function catImage
     * @async
     * @param {string} api - apology api url
     * @return {Object} response
     * @summary perform api call against provided url for advice
     */   
    function catImage(api) {
      axios.get(api)
        .then(response => {
          message.channel.send(response.data[0].url);
        })
        .catch(error => {
          console.log(error);
          return message.channel.send(`I'm unable to grab a cat, sorry master ${message.author}`);
        }); 
    }
    // call cat image api
    catImage(catApi);
  }
};
