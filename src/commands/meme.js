/**
 * Ask butlerbot to send a meme from one of the subreddits.
 * @module meme
 * @return {Object} - image (as a message to discord text channel)
 */
const randomPuppy = require('random-puppy');
module.exports = {
    name: 'meme',
    description: 'Get a top meme from Reddit.',
    cooldown: 1,
    aliases: ['memes'],
    /**
     * @method execute
     * @param {string} message - command, used to determine which channel to return results
     * @return {string} results of advice api call 
     */     
    execute(message) {   
        /** 
         * @var {Object} reddit  
         * @summary list of subreddits to potentially choose from
         */               
        let reddit = [
            "memes",
            "dankmemes",
            "latestagecapitalism",
            "badphilosophy"
        ];
        /** 
         * @var {string} subreddit  
         * @summary randomly selected subreddit
         */               
        let subreddit = reddit[Math.floor(Math.random() * reddit.length)];
        /** 
         * @function apiImageCrawl
         * @async
         * @param {string} sreddit - selected subreddit to crawl through
         * @return {Object} meme.png image
         * @summary Crawl through selected subreddit and choose one image
         */ 
        function apiImageCrawl(sreddit) {
            message.channel.startTyping();
            randomPuppy(sreddit).then(async url => {
                await message.channel.send({
                    files: [{
                        attachment: url,
                        name: 'meme.png'
                    }]
                }).then(() => message.channel.stopTyping());
            }).catch(err => console.error(err));    
        }
        apiImageCrawl(subreddit);
    }
};
