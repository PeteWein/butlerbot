/**
 * Ping the butlerbot server for latency/online status.
 * @module ping
 * @return {string} - message (as a message to discord text channel)
 */
module.exports = {
    name: 'ping',
    description: 'Ping the discord bot to check latency.',
    cooldown: 5,
    /**
     * @method execute
     * @param {string} message - command, used to determine which channel to return results
     * @return {string} results of latency test
     */     
    execute(message) {
        message.channel.send(`🏓 pong! Latency is ${Date.now() - message.createdTimestamp}ms.`);
    },
};
