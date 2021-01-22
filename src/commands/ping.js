module.exports = {
    name: 'ping',
    description: 'Ping the discord bot to check latency.',
    cooldown: 5,
    execute(client, message) {
        message.channel.send(`🏓 pong! Latency is ${Date.now() - message.createdTimestamp}ms.`);
    },
};
