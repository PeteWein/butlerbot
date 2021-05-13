/**
 * Have butlerbot get a meme and apply the previous text to it
 * @module memeit
 * @return {Object} - image (as a message to discord text channel)
 */
const axios = require('axios');
module.exports = {
  name: 'memeit',
  description: 'Overlay previous message onto a meme',
  /**
   * @method execute
   * @param {string} message - command, used to determine which channel to return results
   * @return {string} results of meme api call 
   */  
  execute(message) {   
    /** 
     * @var {string} memeApi
     * @summary Get a random meme
     */
    let memeApi = 'https://api.imgflip.com/get_memes';     
    // axios promise as var
    let memePromise = axios.get(memeApi)
    .then(response => {
      var memeList = response.data.data.memes.filter(function (meme) {
        return meme.box_count <= 2;
      });
      const rand = Math.floor(Math.random() * memeList.length);
      response = memeList[rand];
      console.log(response);
      return response.id;
    })        
    .catch(error => {
      console.log(error);
      return message.channel.send(`I'm unable to meme-ify the message, sorry master ${message.author}`);
    });

    // same deal but for the captioned meme
    let captionApi = 'https://api.imgflip.com/caption_image';     
    // axios promise as var
    let captionPromise = axios.post(captionApi)
    .then(response => {
      var memeList = response.data.data.memes.filter(function (meme) {
        return meme.box_count <= 2;
      });
      const rand = Math.floor(Math.random() * memeList.length);
      response = memeList[rand];
      return response.id;
    })        
    .catch(error => {
      console.log(error);
      return message.channel.send(`I'm unable to caption the message, sorry master ${message.author}`);
    });
    
    // main call
    memePromise.then(meme => {
      console.log(meme);
    });
  }
};
