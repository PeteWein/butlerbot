const randomPuppy = require('random-puppy');

module.exports = {
    name: 'jojo',
    description: 'Get a meme from the Jojo meme subreddit.',
    aliases: ['JoJo', 'Jojo'],
    execute(client, message) {          
        let reddit = [
            "JoJoMemes"
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
