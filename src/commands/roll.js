/**
 * Roll a die or multiple dice.
 * <pre>
 *      This command will roll dice and return the results. A few flows to consider:
 *      - number of dice and the number of dice faces delimited on a 'd'
 *          - delimiter can be capital or lower case;
 *      - multiple dice delimited by a space( ), comma(,), or plus sign(+)
 *      - space delimiting different dice rolls
 *      - multiple types of dice
 *      - multiple dice in roll
 *      - combinations of above
 * <pre>
 * Example Usage and Results:
 * <table style="width:30%;">
 *  <tr><td>Roll Argument(s)</td><td>Result Range</td><td>Example Output</td></tr>
 *  <tr><td>1d6</td><td>number between 1 and 6</td><td>4</td></tr>
 *  <tr><td>2d6</td><td>numbe between 2 and 12</td><td>6 = 4 + 2</td></tr>
 *  <tr><td>1d6 + 1d4</td><td>number between 2 and 10</td><td>4 = 1 + 3</td></tr>
 * </table> 
 * @module roll 
 * @param {...string} dice  - which dice (number of dice and/or type of dice) to roll; required
 * @return {string} - dice results (as a message to discord text channel)
 */
 module.exports = {
    name: 'roll',
    description: 'Roll a die or multiple dice!',
    aliases: ['dice'],
    usage: '#dType, ex: 1d6, 2d8, 1d6 + 1d12, 1d4+1d6, 1d4 1d12',
    args: true,
    cooldown: 0.1,
    /**
     * @method execute
     * @param {string} message - command, used to determine which channel to return results
     * @param {string} args - dice roll passed into arguments
     * @return {string} total of the die or dice rolled (includes each die roll if multiple dice requested) 
     */
    execute(message,args) {   
        /** 
         * @var {integer} dieTotal  
         * @summary total die roll, starting at 0 and incremented up based on die roll
         */
        let dieTotal = 0;
        /**
         * @var {string[]} dieArray 
         * @summary where we will prep and store the dice roll 
         */
        let dieArray = [];
        /**
         * @var {integer[]} diceArray
         * @summary results of each dice result for additional info in the roll 
         */
        let diceArray = [];
        /**
         * @var {string[]} userRoll
         * @summary the user input for the roll command, empty array if undefined
         */
        let userRoll =  args !== undefined ? args : []; 
        /**
         * * check if its one argument (no spaces) and has a plus (multiple dice)
         * if 0 args, program will fail since args are requires
         * if 1 arg, check if its a 1 dice roll or multipled dice without whitespace
         * if it is missing spaces, tell the user and exit the function early
         */
        if (userRoll.length === 1 && userRoll[0].indexOf('+') > -1) {
            userRoll = userRoll[0].split('+');
        }        
        
        // grab the raw input and remove bad array values/split them/etc.
        let i = 0;
        for (i = 0; i < userRoll.length; i++) {
            let roll = userRoll[i].toLowerCase().split('d');
            if (!roll.includes('+')) {
                dieArray.push(roll);
            }
        }
        // roll each set of dice and then increment our total based on the results
        let j = 0;
        for (j = 0; j < dieArray.length; j++) {
            /**
             * Roll each die independently, i.e. a 2d12 can be (1-12) + (1-12), not 2 * (1-12)
             *! NOTE: I am absolutely not a fan of a nested for loop method, but I want to ensure each die is rolled independently
             * Unless someone is rolling an absolutely insane amount of similar dice AND 
             * multiple types of dice combos, it shouldn't even be noticeable
             */
            let k = 0;
            for (k = 0; k < parseInt(dieArray[j][0]); k++) {
                let roll = Math.ceil(Math.random() * parseInt(dieArray[j][1]));
                diceArray.push(roll);
                dieTotal += roll;
            }
        }
        /**
         * Clean up the final results and return them in a message
         *! Note: We add each die roll into the string if multiple are called in order to provide transparency in the rolls 
         */
        let total = "";
        if (diceArray.length <= 1) {
            total = '> ' + dieTotal.toString();
        } else {
            total = '> ' + dieTotal.toString() + ' = ' + diceArray.join(' + ');
        }
        if (!total.includes("NaN")) {
            message.channel.send(total);
        } else {
            let reply = `You haven't used the roll command correctly, ${message.author}!`;
            reply += `\nThe correct usage looks like ${module.exports.usage}`;
            message.channel.send(reply);
        }
    }
};
