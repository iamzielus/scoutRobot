const Discord = require('discord.js');
const {prefix, token, giphyToken, badWords} = require('./config.json')
const client = new Discord.Client();

//Giphy setup

var GphApiClient = require('giphy-js-sdk-core')
giphy = GphApiClient(giphyToken)

//Starting Bot

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activity: {
        name: 'Harcerskie pląsy',
        type: 'PLAYING'
    },
    status: 'online'
  })
});

//Welcome message

client.on('guildMemberAdd', member => {
    let nazwa = member.guild.channels.cache.find(ch => ch.name === 'zasady'); 
    member.guild.channels.cache.find(ch => ch.name === 'powitalny').send({embed: { 
        color: 10181046,
        title: "**Witaj!**",
        description: "**Czuwaj **" + `<@${member.user.id}>` + "**! Rozsiądź się wygodnie przy hufcowym ognisku!**",
        fields: [{
            name: "**REGULAMIN**",
            value: `Aby zaakceptować regulamin przejdź na kanał ${nazwa} i kliknij odpowiednią reakcję.`
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.AvatarURL,
          text: "© #ZHPINO 2020"
        }
        }});
});

//Message filtering

client.on('message', async message => {

    let foundInText = false;
    for (var i in badWords) { // loops through the blacklisted list
      if (message.content.toLowerCase().includes(badWords[i].toLowerCase())) foundInText = true;
    }

      if (foundInText) {
        message.delete({ timeout: 100, reason: 'Słowa!' });
        message.channel.send('**Uważaj na słowa!** :rage:').then(msg => msg.delete({ timeout: 1000, reason: 'It had to be done.' }));
        return;
    }
});

//Moderation commands

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) && !msg.guild && msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "say"){
        let text = args.join(" ");
        msg.delete();
        msg.channel.send(text);
    };
  
    if (command === "kick") 
    {
      let user = msg.mentions.users.first();
      let reason = args.slice(1).join(" ");
      
      if (user)
      {
        const member = msg.guild.member(user);
        if (member) {
          member
            .kick(reason)
            .then(() => {
              giphy.search('gifs', {"q": "sleep"})
              .then((response) => {
                  var totalResponses = response.data.length;
                  var responseIndex = Math.floor((Math.random()*10)+1) % totalResponses;
                  var responseFinal = response.data[responseIndex];
                  msg.channel.send(":wave: " + member.displayName + ` **został wyrzucony z powodu: ${reason}.**`, {
                      files: [responseFinal.images.fixed_height.url]
                  })            }).catch(() => {
                      message.channel.send('**O nie! Wystąpił błąd przy wczytywaniu GIFa** :sob:');
                  })
  
             
         })
            .catch(err => {
              msg.reply('nie można wyrzucić tego użytkownika.');
              console.error(err);
            });
        }
        else 
        {
          msg.reply("nie ma takiego użytkownika.");
        }
      }
      else
      {
        msg.reply("nie oznaczyłeś użytkownika!");
      }
    };

    if (command === "ban") 
    {
      let user = msg.mentions.users.first();
      let reason = args.slice(1).join(" ");
      
      if (user)
      {
        const member = msg.guild.member(user);
        if (member) {
          member
            .ban(reason)
            .then(() => {
              giphy.search('gifs', {"q": "sleep"})
              .then((response) => {
                  var totalResponses = response.data.length;
                  var responseIndex = Math.floor((Math.random()*10)+1) % totalResponses;
                  var responseFinal = response.data[responseIndex];
                  msg.channel.send(":wave: " + member.displayName + ` **został zbanowany z powodu: ${reason}. Już nie wróci do naszego ogniska!**`, {
                      files: [responseFinal.images.fixed_height.url]
                  })            }).catch(() => {
                      message.channel.send('**O nie! Wystąpił błąd przy wczytywaniu GIFa** :sob:');
                  })
  
             
         })
            .catch(err => {
              msg.reply('nie można zbanować tego użytkownika.');
              console.error(err);
            });
        }
        else 
        {
          msg.reply("nie ma takiego użytkownika.");
        }
      }
      else
      {
        msg.reply("nie oznaczyłeś użytkownika!");
      }
    };

    if (command === 'clear') {
      const args = msg.content.split(' ').slice(1); // All arguments behind the command name with the prefix
      const amount = args.join(' '); // Amount of messages which should be deleted

      if (!amount) return msg.reply('Nie podałeś liczby wiadomości do usunięcia'); // Checks if the `amount` parameter is given
      if (isNaN(amount)) return msg.reply('Podaj prawidłową liczbę wiadomości'); // Checks if the `amount` parameter is a number. If not, the command throws an error

      if (amount > 100) return msg.reply('Nie możesz usunąć więcej niż 100 wiadomości na raz!'); // Checks if the `amount` integer is bigger than 100
      if (amount < 1) return msg.reply('Musisz usunąć minimum 1 wiadomość!'); // Checks if the `amount` integer is smaller than 1

        msg.channel.messages.fetch({ limit: amount }).then(messages => { // Fetches the messages
        msg.channel.bulkDelete(messages // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
      )});
    };

    if(command === 'modhelp') {
      msg.channel.send({embed: {
       color: 15158332,
       title: "**Komendy harcBOT'a**",
       description: "**Lista komend dostępnych dla moderatorów**",
       fields: [{
           name: "**KOMENDY**",
           value: `${prefix}modhelp - *wyświetla listę komend dla moderacji*
           ${prefix}kick @nick <powód> - *wyrzuca osobę z serwera. Przy podawaniu powodu zastąp spacje znakiem podłogi*
           ${prefix}ban @nick <powód> - *banuje osobę. Przy podawaniu powodu zastąp spacje znakiem podłogi*
           ${prefix}clear <liczba wiadomości> - *usuwa daną ilość wiadomości*`
         }
       ],
       footer: {
         text: "© Scout Robot 2020"
       }
       }})
   };

  });
  
//User commands  

client.on('message', msg => {

    if (!msg.content.startsWith(prefix) && msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "ping")
    {
        msg.reply('Pong!');
    };

    if(command === "powiedz")
    {
      let text = args.join(" ");
      let user = msg.author.id;
      msg.delete();
      msg.channel.send(`Użytkownik <@${user}> napisał: ${text}`);
    };

    if(command === 'szymon')
    {
      msg.channel.send('Szymuś to bardzo dobry kolega! :heart:')
    };

    if(command === 'gif')
    {
      if(!args.length) msg.channel.send("**Podaj prawidłowy argument**")
      else
      giphy.search('gifs', {"q": `${args}`})
          .then((response) => {
              var totalResponses = response.data.length;
              var responseIndex = Math.floor((Math.random()*10)+1) % totalResponses;
              var responseFinal = response.data[responseIndex];
              msg.channel.send("**Oto twój losowy gif z: " + `${args}` + "!**", {
                  files: [responseFinal.images.fixed_height.url]
              })            }).catch(() => {
                  msg.channel.send('O nie! Wystąpił błąd przy wczytywaniu GIFa :sob:');
              })

    };

    if(msg.content.includes(`co?`))
    {
      giphy.search('gifs', {"q": "meat gif"})
      .then((response) => {
          var totalResponses = response.data.length;
          var responseIndex = Math.floor((Math.random()*10)+1) % totalResponses;
          var responseFinal = response.data[responseIndex];
          msg.reply("**Miencho! 1:0 dla mnie!**", {
              files: [responseFinal.images.fixed_height.url]
          })            }).catch(() => {
              msg.channel.send('O nie! Wystąpił błąd przy wczytywaniu GIFa :sob:');
          })
    };

    //Funkcja losująca liczby

    function randomInt(min, max)
    {
      return min + Math.floor((max - min) * Math.random());
    };
    
    function randomFloat(min, max)
    {
      return min + (max - min) * Math.random();
    };

    //Koniec funkcji

    if(command === 'iq')
    {
      if (!msg.mentions.users.size) {
          return msg.reply('Oznacz prawidłowego użytkownika!');
      }
      let member = msg.mentions.members.first();
      var iq = randomInt(-200, 200);
      msg.channel.send(`<@${member.user.id}>` + "** posiada **" + iq + "** IQ!**").catch(() => {
          msg.channel.send('O nie! Wystąpił błąd przy wczytywaniu GIFa :sob:');
      })  
    };

    if(command === 'help') {
      msg.channel.send({embed: {
       color: 10181046,
       title: "**Komendy harcBOT'a**",
       description: "**Lista komend dostępnych dla każdego użytkownika**",
       fields: [{
           name: "**KOMENDY**",
           value: `${prefix}help - *wyświetla listę komend*
           ${prefix}gif <tematyka gifa - *wyświetla losowy gif (temat musi być w języku angielskim)*
           ${prefix}iq <@nick> - *generuje losowe IQ użytkownika*`
         }
       ],
       footer: {
         text: "© Scout Robot 2020"
       }
       }})
   };
  
});

client.login(token);