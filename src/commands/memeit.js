/**
 * Have butlerbot get a meme and apply the previous text to it
 * @module memeit
 * @return {Object} - image (as a message to discord text channel)
 */
const axios = require('axios');
const queryString = require('query-string');

module.exports = {
  name: 'memeit',
  description: 'Overlay previous message onto a randomly selected meme',
  /**
   * @method execute
   * @param {string} message - command, used to determine which channel to return results
   * @return {string} link to custom meme created
   */  
  execute(message) { 
    /** 
     * @const {string} memeApi
     * @summary Get a random meme from imglfip API
     */
    const memeApi = 'https://api.imgflip.com/get_memes';     
    // grab the full list of memes and randomly select one from the list
    let memePromise = axios.get(memeApi)
    .then(response => {
      /** 
       * @var {string} memeList
       * @summary list of JSON objects including meme and ID
       */      
      var memeList = response.data.data.memes.filter(function (meme) {
        return meme.box_count <= 2;
      });
      // pick a random meme from the list and return the id, needed for the meme generation
      const rand = Math.floor(Math.random() * memeList.length);
      response = memeList[rand];
      return response.id;
    })        
    .catch(error => {
      /* istanbul ignore next */
      return message.channel.send(`I'm to find a suitable meme, sorry master ${message.author}`);
    });
    // determine if message is reply
    /* istanbul ignore next */
    if (message.reference !== null) {
      memePromise.then(memeId => {
        message.channel.messages.fetch(message.reference.messageID).then(messages => {
          /** 
           * @var {string} body
           * @summary Body of request for meme
           */
          let body = queryString.stringify({
            'username': process.env.IMGFLIP_USERNAME,
            'password': process.env.IMGFLIP_PASSWORD,
            'template_id': memeId,
            'text0': messages.content,
            'text1': ''
            }); 
            return body;
          }
        )
        // sent fully formed request to api and return the link to the image
        .then((captionBody) => {
          /** 
           * @const {string} captionApi
           * @summary caption image endpoint used to generate custom meme
           */
          const captionApi = 'https://api.imgflip.com/caption_image';     
          // post request with our custom text and random image, then send to channel
          axios.post(captionApi + '?' + captionBody)
          .then(response => {
            message.channel.send(response.data.data.url);
          })        
          .catch(error => {
            console.log(error);
            return message.channel.send(`I'm unable to caption the message, sorry master ${message.author}`);
          });
        });  
      });  
    } else {
      memePromise.then(memeId => {
        message.channel.messages.fetch({ limit: 2 }).then(messages => {
          /** 
           * @var {string} body
           * @summary Body of request for meme
           */
          let body = queryString.stringify({
            'username': process.env.IMGFLIP_USERNAME,
            'password': process.env.IMGFLIP_PASSWORD,
            'template_id': memeId,
            'text0': messages.last().content,
            'text1': ''
            });      
            return body;
          }
        )
        // sent fully formed request to api and return the link to the image
        .then((captionBody) => {
          /** 
           * @const {string} captionApi
           * @summary caption image endpoint used to generate custom meme
           */
          const captionApi = 'https://api.imgflip.com/caption_image';     
          // post request with our custom text and random image, then send to channel
          axios.post(captionApi + '?' + captionBody)
          .then(response => {
            message.channel.send(response.data.data.url);
          })        
          .catch(error => {
            console.log(error);
            return message.channel.send(`I'm unable to caption the message, sorry master ${message.author}`);
          });
        });  
      });  
    }
  }
};
