/*
 * https://anapioficeandfire.com/Documentation
 * http://www.icndb.com/api/
 * We are going to steal a GoT title/alias as our intro title, because finding good APIs with fun titles is fairly rare.
 * It will allow either self introduction or someone else, using a terniary operator.
 * After it gets the intro and title, it should give some sort of cool comment about them.
 * The comment is really a chuck norris joke with their username as the name.
 */
const axios = require('axios');

module.exports = {
  name: 'introduce',
  description: 'Introduce yourself or someone else to the channel!',
  aliases: ['intro', 'introduction', 'welcome'],
  usage: '@recipient or empty for self introduction.',
  cooldown: 1,  
  execute(message, args) {
    
    message.channel.startTyping();

    // either @arg or pick the author if empty, includes the ID mention info
    const auth = (!args.length) ? message.author : args[0];
    
    // grab the actual name of the user for the silly comment about them, no tag attached
    var authName = (!args.length) ? message.author.username : args[0];

    // if they send it with a mention, get the username from the mention id (for the comment)
	if (authName.startsWith('<') && authName.endsWith('>')) {
		authName = message.mentions.users.first().username;
    }

    // randomly select from one of 500 characters to get a title
    var num = Math.floor(Math.random() * 500) + 1;

    // main request consts, one for the title and one for the comment
    const reqOne = axios.get(`https://www.anapioficeandfire.com/api/characters/${num}`);
    const reqTwo = axios.get(`http://api.icndb.com/jokes/random?firstName=${authName}&lastName=`);

    // perform all of the api requests
    axios.all([reqOne, reqTwo]).then(axios.spread((...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];

        // grab the aliases and titles, concat, and remove empty entries
        const titleList = responseOne.data.titles.concat(responseOne.data.aliases).filter(v=>v!='');
        var title = titleList[Math.floor(Math.random() * titleList.length)];
        if ( typeof title === 'undefined') {
            // if we get an empty list, overwrite the title var with this and use it
            var title = 'Master';
        }
        // send the arrival with title
        message.channel.send(`@here Announcing the arrival of ${title} ${auth}!`);
        
        // follow up with the silly comment (clean it and get it ready for transport)
        let outputJoke = responseTwo.data.value.joke.replace(/\s+/g,' ').trim();
        outputJoke = outputJoke.replace(/&quot;/g, '"');
        message.channel.send(outputJoke);
      }))
      .then(() => message.channel.stopTyping())
      .catch(errors => {
        console.error(errors);
        return message.channel.send(`I'm unable properly introduce at this time, sorry master ${message.author}`);
    }); 
  }
};
