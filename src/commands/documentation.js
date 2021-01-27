/**
 * Have butlerbot provide a link to the landing page.
 * @module documentation
 * @return {string} - string (as a message to discord text channel)
 */
module.exports = {
    name: 'documentation',
    description: 'Link to website for butlerbot.',
    aliases: ['doc', 'credentials', 'resume'],
    cooldown: 5,
    /**
     * @method execute
     * @param {string} message - command, used to determine which channel to return results
     * @return {string} message with link to landing page.
     */      
    execute(message) {
        message.channel.send(`Of course, master ${message.author}. \nMore information about my resume can be found here:\nhttps://petewein.github.io/butlerbot/`);
    },
};
