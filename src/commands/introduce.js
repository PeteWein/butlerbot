/**
 * Introduce a discord member to the channel.
 * <pre>
 *    We are going to use a GoT title/alias as our intro title, because finding good APIs with fun titles is fairly rare.
 *    It will allow either self introduction or someone else, using a terniary operator.
 *    After it gets the intro and title, it should give some sort of cool comment about them.
 *    The comment is really a chuck norris joke with their username as the name.
 *    GoT Title API: https://anapioficeandfire.com/Documentation
 *    Chuck Norris Fact API: http://www.icndb.com/api/
 * @module introduce
 * @param {Object} user - which user to introduce
 * @return {string} - title and fun fact introduction (as a message to discord text channel)
 */
const axios = require('axios');
module.exports = {
  name: 'introduce',
  description: 'Introduce yourself or someone else to the channel!',
  aliases: ['intro', 'introduction', 'welcome'],
  usage: '@recipient or empty for self introduction.',
  cooldown: 1,  
  /**
   * @method execute
   * @param {string} message - command, used to determine which channel to return results
   * @param {string} args - recipient of introduction info to sent to channel; optional
   * @return {string} selected introduction infformation with correct formatting and recipient
   */    
  execute(message, args) {
    
    message.channel.startTyping();

    /**
     * @const auth
     * @summary either arg or pick the author if empty, includes the ID mention info
     */
    const auth = (!args.length) ? message.author : args[0];
    
    /**
     * @var authName
     * @summary grab the actual name of the user for the silly comment about them, no tag attached
     */
    let authName = (!args.length) ? message.author.username : args[0];

    // if they send it with a mention, get the username from the mention id (for the comment)
    /* istanbul ignore next */
    if (authName.startsWith('<') && authName.endsWith('>')) {
      authName = message.mentions.users.first().username;
    }
    /**
     * @var num
     * @summary randomly select from one of 500 characters to get a title
     */
    let num = Math.floor(Math.random() * 500) + 1;

    /**
     * @const reqOne
     * @summary object to do an axios request for the title, using the number to randomly pick
     */
    const reqOne = axios.get(`https://www.anapioficeandfire.com/api/characters/${num}`);
    /**
     * @const reqTwo
     * @summary object to do an axios request for the fun fact, using the authName to populate who the fact uses
     */
    const reqTwo = axios.get(`http://api.icndb.com/jokes/random?firstName=${authName}&lastName=`);
    
    /** 
     * @function getTitleAndFact
     * @async
     * @param {string} reqOne
     * @param {string} reqTwo
     * @return {Object} response
     * @summary perform api calls for title and fun fact
     */          
    function getTitleAndFact(reqOne, reqTwo) {
      // perform all of the api requests
      Promise.all([reqOne, reqTwo]).then(responses => {
          /**@const responseOne */
          const responseOne = responses[0];
          /**@const responseTwo */
          const responseTwo = responses[1];
          /**
           * @const titleList
           * @summary grab the aliases and titles, concat, and remove empty entries
           */
          const titleList = responseOne.data.titles.concat(responseOne.data.aliases).filter(v=>v!='');
          /**
           * @var title
           * @summary randomly selected title, if returned object had more than one
           */          
          let title = titleList[Math.floor(Math.random() * titleList.length)];
          
          //! if we received an empty result, have an option ready to use
          if ( typeof title === 'undefined') {
              title = 'Master';
          }
          /**
           * @var outputJoke
           * @summary randomly chosen joke
           */   
          let outputJoke = responseTwo.data.value.joke.replace(/\s+/g,' ').trim();
          outputJoke = outputJoke.replace(/&quot;/g, '"');
          // send the arrival with title
          let messageOut = `@here Announcing the arrival of ${title} ${auth}!\n` + outputJoke;
          message.channel.send(messageOut);
        })
        .then(message.channel.stopTyping(true))
        .catch(errors => {
          console.error(errors);
          return message.channel.send(`I'm unable properly introduce at this time, sorry master ${message.author}`);
      }); 
    }
    getTitleAndFact(reqOne, reqTwo);
  }
};
