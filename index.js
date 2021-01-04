const Discord = require('discord.js');                      // Discord lib
require('dotenv').config();                                 // Environment lib
const TOKEN = process.env.TOKEN;                            // Getting bot's token
const { prefix } = require('./config.json');                // Importing configs
const command = require('./commands.js');                   // Importing command structure from another file
const client = new Discord.Client();                        // Creating client

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);          // Logging start to console
  client.user.setPresence({                                 // Set RichPresence
    activity: {
        name: "harcerskie piosenki",
        type: 'LISTENING'
    },
    status: 'online'
  });                                                       // End of RichPresence

  command(client, ['ping','test'], (msg) => {               // Ping command
    msg.reply('hello there!');
  });

  command(client, ['cc', 'clearchat', 'wyczysc'], (msg) => {      // Clear chat command
    if(msg.member.hasPermission('MANAGE_MESSAGES')){
    const args = msg.content.split(' ').slice(1); // All arguments behind the command name with the prefix
    const amount = Number(args.join(' ')); // Amount of messages which should be deleted
    msg.delete();

    if (!amount) return msg.reply('nie podałeś liczby wiadomości do usunięcia.').then(reply => {reply.delete({timeout:5000})}); // Checks if the `amount` parameter is given
    if (isNaN(amount)) return msg.reply('podaj prawidłową liczbę wiadomości.').then(reply => {reply.delete({timeout:5000})}); // Checks if the `amount` parameter is a number. If not, the command throws an error

    if (amount > 100) return msg.reply('nie możesz usunąć więcej niż 100 wiadomości na raz!').then(reply => {reply.delete({timeout:5000})}); // Checks if the `amount` integer is bigger than 100
    if (amount < 1) return msg.reply('musisz usunąć minimum 1 wiadomość!').then(reply => {reply.delete({timeout:5000})}); // Checks if the `amount` integer is smaller than 1

    setTimeout(() => {
      msg.channel.messages.fetch({ limit: amount }).then(messages => { // Fetches the messages
      msg.channel.bulkDelete(messages // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
      ).catch(console.error)});
      msg.channel.send(`:recycle: **Usunięto ${amount} wiadomości.**`).then(message => {
      message.delete({timeout:5000});
    });
    }, 500)
    }
  });

  command(client, ['censore', 'cenzura', 'delmsg'], (msg) => {
    if (msg.member.hasPermission['MANAGE_MESSAGES']){
      const args = msg.content.slice(prefix.length).trim().split(/ +/g);
      if (!args){
        msg.reply("brak argumentu");
      }
      else{
        let censoredID = msg.content.split(' ').slice(1);
        msg.delete();
        msg.channel.messages.fetch(`${censoredID}`)
        .then(message => {
        message.delete().then(msg.channel.send(`${client.emojis.cache.find(emoji => emoji.name === 'weewoo')} ***Ocenzurowano wiadomość.***`).then(info => {info.delete({timeout: 2000})}))
        }).catch(err => {
          msg.reply(`:x:***nie można usunąć wiadomości.***`).then(replyMsg => {replyMsg.delete({timeout:2000})});
          console.error(err);
        });
      }
    }
  });
});

client.login(TOKEN);