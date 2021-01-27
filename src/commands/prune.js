/**
 * Remove a specified number of messages from the channel.
 * @module prune
 * @return {string | null} - message (as a message to discord text channel); no message sent if successful
 */
module.exports = {
	name: 'prune',
	description: 'Prune up to 99 messages.',
    /**
     * @method execute
     * @param {string} message - command, used to determine which channel to return results
     * @param {string} args - number of messages to remove (between 1 and 99)
     * @return {string | null} any errors; null on success 
     */     	
	execute(message, args) {
        /** 
         * @const {integer} amount  
         * @summary number of messages to remove
         */   
		const amount = parseInt(args[0]) + 1;
        /** 
         * @function pruneChannel
         * @param {integer} count - how many messages to delete
         * @return {string | null} message if error, otherwise null 
         * @summary bulk delete the number of messages requested
         */ 		
		function pruneChannel(count) {
			if (isNaN(count)) {
				return message.reply('that doesn\'t seem to be a valid number.');
			} else if (count <= 1 || count > 100) {
				return message.reply('you need to input a number between 1 and 99.');
			}
			message.channel.bulkDelete(count, true).catch(err => {
				console.error(err);
				message.channel.send('there was an error trying to prune messages in this channel!');
			});	
		}
		pruneChannel(amount);
	},
};
