const randomPuppy = require('random-puppy');


module.exports = {
    name: 'meme',
    description: 'Get a top meme from Reddit.',
    aliases: ['memes'],
    execute(message) {          
        let reddit = [
            "memes",
            "dankmemes",
            "latestagecapitalism",
            "badphilosophy"
        ];

        let subreddit = reddit[Math.floor(Math.random() * reddit.length)];

        message.channel.startTyping();

        randomPuppy(subreddit).then(async url => {
            await message.channel.send({
                files: [{
                    attachment: url,
                    name: 'meme.png'
                }]
            }).then(() => message.channel.stopTyping());
        }).catch(err => console.error(err));
    }
};
