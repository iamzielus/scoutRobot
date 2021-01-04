//File with all of the commands inside.
const { prefix } = require('./config.json'); //Importing configs

module.exports = (client, aliases, callback) => {
    if (typeof aliases === 'string'){
        aliases = [aliases];
    };

    client.on('message', msg => {
        const { content } = msg;
        const author = msg.author.username;
        aliases.forEach(alias => {
            const command = `${prefix}${alias}`;

            if ((content.startsWith(`${command} `) || content === command) && !msg.author.bot){
                console.log(`User ${author} issued command ${command}`);
                callback(msg);
            };
        });
    });
}