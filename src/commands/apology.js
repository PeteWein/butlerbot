/**
 * Ask butlerbot to send an apology on your behalf.
 * @module apology
 * @return {string} - apology message (as a message to discord text channel)
 */
module.exports = {
	name: 'apology',
    description: 'Have butlerbot apologize on your behalf, and take ownership of the mistake.',
    aliases: ['sorry', 'apologize', "apologise", "mybad"],
    usage: '@recipient',
    args: true,
    /**
     * @method execute
     * @param {string} message - command, used to determine which channel to return results
     * @param {string} args - recipient of apology message sent to channel; required
     * @return {string} selected apology with correct formatting and recipient
     */  
    execute(message,args) {   
        /** 
         * @function getApology
         * @return {Object} apology
         * @summary selection of random apology from list
         */    
        function pickApology () {
            /** 
             * @var {string[]} apologyMessages  
             * @summary list of pre-generated apology messages
             */
            let apologyMessages = [
                "my deepest apologies. This is a mistake I will not make again and I volunteer a paycheck reduction.",
                "I owe you an apology. It was never my intention to cause you distress. " + 
                "I wish I’d thought of your feelings as well. But, it is never too late to make things right.",
                "I’m not perfect, I make mistakes, I hurt people. But when I say sorry, I mean it.",
                "I am sorry. I don't know what I was thinking. Obviously I wasn't thinking.",
                "I apologize -- I wouldn't blame you if you don't forgive me. I've messed up big time. I shall commence the self-flagellation at dawn.",
                "I take full responsibility for my action. I know that I could have done things differently, but I made a poor decision that I regret now. " +
                "Please forgive me for my lack of wisdom in the situation. I will revoke all evening tea for the evening for myself.",
                "I am very sorry for what happened. It was unacceptable and will never happen again, unless of course I am asked to.",
                "I want to extend my sincerest apologies for the negative experience that you had.",
                "I hope you will accept my sincere apologies for the inconvenience you experienced."
            ];
            let apologySelection = apologyMessages[Math.floor(Math.random() * apologyMessages.length)];
            return apologySelection;
        }
        /** 
         * @var {string} apology  
         * @summary randomly selected an apology from the list of apologyMessages
         */         
        let apology = pickApology();       
        message.channel.send(`${args}, on behalf of ${message.author}, ${apology}`);
    }
};
