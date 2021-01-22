/*
 * This command will roll dice and return the results. A few flows to consider:
 * one die can be xDy or xdy;
 * multiple dice, split on a + or ,;
 * space or no space between dice (1d6+1d12, 1d6 + 1d12);
 * multiple types of dice, 1d6 and 1d12;
 * multiple dice in roll, 2d6;
 * combinations of above (2d6 + 1d12);
 */

module.exports = {
	name: 'roll',
    description: 'Roll a die or multiple dice!',
    aliases: ['dice'],
    usage: '#dType, ex: 1d6, 2d8, 1d6 + 1d12, 1d4+1d6, 1d4 1d12',
    args: true,
    cooldown: 0.1,
    execute(message,args) {   
        /*
         * Below is what each var represents:
         * dieTotal: total die roll, starting at 0 and incremented up based on die roll
         * diceArray: where we will prep and store the dice roll
         * diceArray: results of each dice result for additional info in the roll
         * userRoll: the user input for the roll command
         */
        let dieTotal = 0;
        let dieArray = [];
        let diceArray = [];
        let userRoll =  args !== undefined ? args : []; 
        /*
         * check if its one argument (no spaces) and has a plus (multiple dice)
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
            /*
             * Roll each die independently, i.e. a 2d12 can be (1-12) + (1-12), not 2 * (1-12)
             * NOTE: I am absolutely not a fan of a nested for loop method, but I want to ensure each die is rolled independently
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
