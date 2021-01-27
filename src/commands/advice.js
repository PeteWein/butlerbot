/**
 * Ask butlerbot for sagely advice.
 * @module advice 
 * @return {string} - advice (as a message to discord text channel)
 */
const axios = require('axios');
module.exports = {
  name: 'advice',
  description: 'Ask for butlerbot\'s advice on a question.',
  aliases: ['advise'],
  /**
   * @method execute
   * @param {string} message - command, used to determine which channel to return results
   * @return {string} results of advice api call 
   */  
  execute(message) {   
    /** 
     * @var {string} adviceApi  
     * @summary apology api url
     */
    let adviceApi = 'https://api.adviceslip.com/advice';   
    /** 
     * @function getAdvice
     * @async
     * @param {string} adviceApi - apology api url
     * @return {Object} response
     * @summary web location to perform api call against for advice
     */    
    function getAdvice (api) {
      axios.get(api)
      .then(response => {
        message.channel.send(response.data.slip.advice);
      })
      .catch(error => {
        console.log(error);
        return message.channel.send(`I do not think I can help you with this, sorry ${message.author}`);
      });   
    }
    //* call getAdvice method with our apology api
    getAdvice(adviceApi);
  }
};
