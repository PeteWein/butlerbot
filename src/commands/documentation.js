module.exports = {
    name: 'documentation',
    description: 'Link to website for butlerbot.',
    aliases: ['doc', 'credentials', 'resume'],
    cooldown: 5,
    execute(client, message) {
        message.channel.send(`Of course, master ${message.author}. \nMore information about my resume can be found here:\nhttps://petewein.github.io/butlerbot/`);
    },
};
