/**
 * Have butlerbot play, stop, skip, or queue the audio 
 * @module play
 * @return {Object} - string (as a message to discord text channel)
 */
const ytdl = require('ytdl-core');
module.exports = {
    name: 'play',
    description: 'Play, Pause, Skip, Stop, or Queue music from Youtube.',
    aliases: ['pause','resume','skip','stop','queue'],
    usage: '<youtube-link>',
    args: true,
    cooldown: 0.5,
    /**
     * @method execute
     * @param {string} client - discord bot object, allows us to include certain information about the bot itself
     * @param {string} message - command, used to determine which channel to return results
     * @return {string} embedded message
     */  	
    execute(message) {
      console.log("Playing Music command...");
      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);
      console.log(serverQueue);

    }
};
