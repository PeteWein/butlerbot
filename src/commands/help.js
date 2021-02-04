/**
 * Have butlerbot dynamically list all available commands and descriptions.
 * @module help
 * @return {Object} - string (as a message to discord text channel)
 */
const { prefix } = require('../../config.json');
module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 2,
    /**
     * @method execute
     * @param {string} message - command, used to determine which channel to return results
     * @param {string} args - additional information requested on a particular command
     * @return {string} results of dog api call 
     */  
    execute(message, args) {
        /** @var {Object} data */  
        const data = [];
        /** 
         * @var {Object} commands
         * @summary all available commands
         */          
        const { commands } = message.client;
        
        // * grab all of the commands and push them into the data object before returning that object as a message
        if (!args.length) {
            data.push('Here\'s a list of all my commands:\n');
            data.push('> '.concat(commands.map(command => command.name + ':\n>\t' + command.description).join('\n> ')));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            return message.channel.send(data, { split: true });
        }
        /** @var {string} name */  
        const name = args[0].toLowerCase();
        /** @var {string} name */  
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        
        if (!command) {
            return message.reply('that\'s not a valid command!');
        }
        // * if requesting a specific command, grab only that one and send it
        data.push(`**Name:** ${command.name}`);
        
        /* istanbul ignore else */
        if (command.aliases) {
            data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        }
        /* istanbul ignore else */
        if (command.description) {
            data.push(`**Description:** ${command.description}`);
        }
        /* istanbul ignore else */
        if (command.usage) {
            data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        }
        /* istanbul ignore else */
        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
        
        message.channel.send(data, { split: true });        
	}
};
