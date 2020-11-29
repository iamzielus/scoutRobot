const Discord = require('discord.js');
const fs = require('fs');
const configFileName = './config.json';
const file = require(configFileName);
const {prefix, giphyToken, badWords, reactionMsgID} = require('./config.json');
const client = new Discord.Client();
const embedGif = new Discord.MessageEmbed()
require('dotenv-flow').config();



const config = {
  token: process.env.TOKEN,
  giphyToken: process.env.GIPHYTOKEN
}

//Giphy setup

var GphApiClient = require('giphy-js-sdk-core')
giphy = GphApiClient(config.giphyToken)

//Starting Bot

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activity: {
        name: 'Harcerskie pląsy',
        type: 'PLAYING'
    },
    status: 'online'
  });
});

//Welcome message (CANNOT BE DONE WITHOUT 24/7 HOSTING!!!)
/*
client.on('guildMemberAdd', member => {
    let zasady = member.guild.channels.cache.find(ch => ch.name === '📃regulamin📃');
    let chRole = member.guild.channels.cache.find(ch => ch.name === '✏role✏'); 
    member.guild.channels.cache.find(ch => ch.name === '👋dzień-dobry👋').send({embed: { 
        color: 10181046,
        title: "**Witaj!**",
        description: "**Czuwaj **" + `<@${member.user.id}>` + "**! Rozsiądź się wygodnie przy naszym ognisku!**",
        fields: [{
            name: "**REGULAMIN**",
            value: `Aby zaakceptować regulamin przejdź na kanał ${zasady}, przeczytaj regulamin i postępuj zgodnie z dalszymi instrukcjami.`
          },
          {
            name: "**ROLE**",
            value: `Aby otrzymać odpowiednie role przejdź na kanał ${chRole} i kliknij odpowiednie reakcje.`
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.AvatarURL,
          text: "© Scout Robot 2020"
        }
        }});
});
*/
//Message filtering
/*
client.on('message', async message => {

    let foundInText = false;
    for (var i in badWords) { // loops through the blacklisted list
      if (message.content.toLowerCase().includes(badWords[i].toLowerCase())) foundInText = true;
    };

    if (foundInText) {
        message.delete({ timeout: 100, reason: 'Słowa!' });
        message.channel.send('**Uważaj na słowa!** :rage:').then(msg => msg.delete({ timeout: 1000, reason: 'It had to be done.' }));
        return;
    }; 
});
*/
//Moderation commands

client.on('message', msg => {
    if (msg.content.startsWith(prefix) && msg.guild && !msg.author.bot)
    {
    if (msg.member.hasPermission(['BAN_MEMBERS']))
    {
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
  
    /*
    if(command === "reactmsg")
    {
      msg.delete();
      let channel = client.channels.cache.find(channel => channel.name === 'zasady');
      channel.send({embed: {
        color: 15158332,
        title: "**REGULAMIN SERWERA**",
        description: "Aby zatwierdzić regulamin kliknij reakcję pod wiadomością. Po zatwierdzeniu otrzymasz rolę, która umożliwi przeglądanie reszty kanałów.",
        fields: [{
            name: "**Zasady**",
            value: `*Pierwsza zasada.*
            *Druga zasada.*
            *Trzecia zasada*
            *Czwarta zasada*`
          }
        ],
        footer: {
          text: "© Scout Robot 2020"
        }
        }})
          .then(message => {
          msg.channel.messages.fetch(reactionMsgID).then(oldmsg => {
            oldmsg.delete().catch(console.error);
          }).catch(console.error);
          message.react("✅").catch(console.error);
          file.reactionMsgID = message.id
          fs.writeFile(configFileName, JSON.stringify(file), function writeJSON(err) {
          if (err) return console.log(err);
          console.log('writing to ' + configFileName);
          });
        });
    }
    */
  
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
                  msg.channel.send(`${client.emojis.cache.find(emoji => emoji.name === 'weewoo')}` + member.displayName + ` **został wyrzucony z powodu: ${reason}.**`, {
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
                  msg.channel.send(`${client.emojis.cache.find(emoji => emoji.name === 'weewoo')}` + member.displayName + ` **został zbanowany z powodu: ${reason}. Już nie wróci do naszego ogniska!**`, {
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

    if(command === 'modhelp') {
      msg.channel.send({embed: {
       color: 15158332,
       title: `${client.emojis.cache.get("715457208896323604")}**Komendy harcBOT'a**${client.emojis.cache.get("715457208896323604")}`,
       description: "**Lista komend dostępnych dla moderatorów**",
       fields: [{
           name: "**KOMENDY**",
           value: `${prefix}modhelp - *wyświetla listę komend dla moderacji*
           ${prefix}kick @nick <powód> - *wyrzuca osobę z serwera. Przy podawaniu powodu zastąp spacje znakiem podłogi*
           ${prefix}ban @nick <powód> - *banuje osobę. Przy podawaniu powodu zastąp spacje znakiem podłogi*
           ${prefix}clear <liczba wiadomości> - *usuwa podaną ilość wiadomości*
           ${prefix}reactmsg - *wysyła reactionRolesMessage*`
         }
       ],
       footer: {
         text: "© Scout Robot 2020"
       }
       }})
   };

   if(command === 'rolesmsg') {
    msg.channel.send({embed: {
     color: 15158332,
     title: `**Role dostępne na serwerze**`,
     description: "**Kliknij na odpowiednią reakcję, aby otrzymać role.**",
     fields: [{
         name: "**Role**",
         value: `:female_sign: - *kobiety*
         :male_sign: - *mężczyzna*
         :fleur_de_lis: - *ZHP*
         :four_leaf_clover: - *ZHR*
         :smiley_cat: - *poniżej 14 lat*
         :joy_cat: - *14 - 16 lat*
         :smirk_cat: - *16-18 lat*
         :heart_eyes_cat: - *18+*
         :japanese_goblin: - *gracz mafia*
         :video_game: - *gracz Among Us* `,
     }],
     footer: {
       text: "© Scout Robot 2020"
     }
     }})
 };

 if(command === 'regulamin') {
  msg.delete();
  msg.channel.send({embed: {
   color: 10181046,
   title: "**Regulamin**",
   description: "**Zostaw reakcję, aby potwierdzić zapoznanie się z regulaminem.**",
   fields: [{
       name: "**OGÓLNE ZASADY**",
       value: `◈ Poza Regulaminem Społeczności tego serwera przestrzegaj również Warunków Usługi Discord (https://discordapp.com/terms).
       ◈ Pamiętaj o przestrzeganiu Prawa Harcerskiego.
       ◈ Żadnego nękania, mowy nienawiści czy obelg na tle rasowym i nie tylko. Bądźmy wszyscy przyjaźni i nie kłóćmy się.
       ◈ Nie reklamuj zewnętrznych stron, innych serwerów Discord oraz akcji na kanałach głosowych/tekstowych (za wyjątkiem zgody <@&703370198740107266> ).
       ◈ Zakaz ustawiania sobie obraźliwego nicku/avatar’a oraz podszywania się. Administracja zastrzega sobie prawo do zmiany nieodpowiedniego pseudonimu.
       ◈ Zakaz wstawiania zdjęć oraz upubliczniania danych osobowych użytkowników serwera bez ich zgody.
       ◈ Administracja może zmienić regulamin w każdej chwili. Zmiany regulaminu oraz inne istotne decyzje będą ogłaszane na kanale <#780468785499996180>
       ◈ Administracja może karać za rzeczy nieobecne w regulaminie. 
       ◈ Nieznajomość regulaminu nie zwalnia z jego przestrzegania.`,
   }]
   }});
   msg.channel.send({embed: {
    color: 10181046,
    fields: [
    {
     name: "**REGULAMIN KANAŁÓW TEKSTOWYCH**",
     value: `◈ Używaj kanałów zgodnie z ich przeznaczeniem.
     ◈ Zakaz zamieszczania treści NSFW/NSFL.
     ◈ Nie spamuj, nie flooduj oraz nie nadużywaj caps locka.
     ◈ Zachowaj kulturę osobistą i języka. Pamiętaj, o szacunku wobec innych użytkowników.`,
 },
 {
   name: "**REGULAMIN KANAŁÓW GŁOSOWYCH**",
   value: `◈ Używaj kanałów zgodnie z ich przeznaczeniem.
   ◈ Nie używaj przesterów celowo.
   ◈ Nie przeszkadzaj innym w dyskusji.
   ◈ Zachowuj kulturę w swoich wypowiedziach.
   ◈ Nagrywanie rozmów jest zabronione (wyjątkiem jest zgoda każdego z uczestników rozmowy).`,
 }],
    footer: {
      text: "© Scout Robot 2020"
    }
    }}).then(message => {
    message.react("✅").catch(console.error);
   });
};

if(command === 'changelog') {
  msg.delete();
  msg.channel.send({embed: {
   color: 10181046,
   title: "**CHANGELOG**",
   description: "**Przedstawienie zmian na serwerze - na dzień 23.11.2020**",
   fields: [{
       name: "**AKTUALIZACJA REGULAMINU**",
       value: `◈ Zmieniono regulamin. Prosimy o zapoznanie się z zaktualizowaną treścią oraz zostawienie reakcji pod wiadomością.`,
   },
   {
    name: "**UPORZĄDKOWANIE KANAŁÓW**",
    value: `◈ Zaktulizowano nazwy i opisy kanałów.
    ◈ Dodano kilka knowych kanałów oraz kategorii.`,
},
{
  name: "**NOWOŚCI NA SERWERZE**",
  value: `◈ Stworzono prywatne kanały dla jednostek (zastępów/drużyn etc.) - szczegóły na kanale <#780183793046126633> .
  ◈ Stworzono kanały dla poszczególnych funkcyjnych. Aby otrzymać rolę z dostępem do kanału należy zgłosić się do <@&778984132117004349> .`,
}],
   footer: {
     text: "© Scout Robot 2020"
   }
   }}).then(message => {
    message.react("✅").catch(console.error);
   });
  msg.channel.send(`@everyone **Zapraszamy do zapoznania się ze zmianami!**`);
};

if(command === 'chpomoc') {
  msg.delete();
  msg.channel.send({embed: {
   color: 10181046,
   title: "**KANAŁ POMOCY**",
   fields: [{
       name: "**Do czego służy ten kanał?**",
       value: `*Ten kanał służy do komunikacji z administracją serwera w przypadku jakichkolwiek problemów/pytań/próśb.
       Staff stara się pełnić całodobową służbę na serwerze, jednak prosimy o wyrozumiałość w przypadku późnej odpowiedzi.*`,
   }],
   footer: {
     text: "© Scout Robot 2020"
   }
   }}).then(message => {
    message.react("✅").catch(console.error);
   });
};

if(command === 'priv') {
  msg.delete();
  msg.channel.send({embed: {
   color: 10181046,
   title: "**STREFA PRYWATNA**",
   description: `*FAQ - Strefa prywatna*`,
   fields: [{
       name: "**Do czego służy ta kategoria?**",
       value: `*Wiele drużyn przenosi swoją działalność do sieci. Część z nich wybiera Discorda jako platformę działania. Chcemy umożliwić zastępom, drużynom etc. organizację pracy zdalnej.
       W tym celu powstała ta kategoria. Jeśli chcesz stworzyć kanał tekstowy i/lub głosowy dla swojej jednostki - złóż zgłoszenie zgodnie z poniższym wzorem.*`,
   },
   {
    name: "**WZÓR**",
    value: `*Nazwa jednostki:
    Twoja funkcja: 
    Kanał tekstowy: (tak/nie)
    Kanał głosowy: (tak/nie)*`,
}],
   footer: {
     text: "© Scout Robot 2020"
   }
   }}).then(message => {
    message.react("✅").catch(console.error);
   });
};

  }

  if (msg.member.hasPermission(['MANAGE_MESSAGES']))
{
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'clear') {
    const args = msg.content.split(' ').slice(1); // All arguments behind the command name with the prefix
    const amount = Number(args.join(' ')); // Amount of messages which should be deleted

    if (!amount) return msg.reply('Nie podałeś liczby wiadomości do usunięcia'); // Checks if the `amount` parameter is given
    if (isNaN(amount)) return msg.reply('Podaj prawidłową liczbę wiadomości'); // Checks if the `amount` parameter is a number. If not, the command throws an error

    if (amount > 100) return msg.reply('Nie możesz usunąć więcej niż 100 wiadomości na raz!'); // Checks if the `amount` integer is bigger than 100
    if (amount < 1) return msg.reply('Musisz usunąć minimum 1 wiadomość!'); // Checks if the `amount` integer is smaller than 1
      msg.delete();
      msg.channel.messages.fetch({ limit: amount }).then(messages => { // Fetches the messages
      msg.channel.bulkDelete(messages // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
    ).catch(console.error)});
    msg.channel.send(`:recycle: **Usunięto ${amount} wiadomości.**`).then(message => {
      message.delete({timeout:5000});
    });      
  };

  if (command === 'censore')
  {
    if (!args)
    {
      msg.reply("brak argumentu");
    }
    else
    {
      let censoredID = msg.content.split(' ').slice(1);
    msg.delete();
    msg.channel.messages.fetch(`${censoredID}`)
    .then(message => {
    message.delete().then(msg.channel.send(`${client.emojis.cache.find(emoji => emoji.name === 'weewoo')} ***Ocenzurowano wiadomość.***`).then(info => {info.delete({timeout: 2000})}))
    }).catch(err => {
      msg.reply(`:x:***nie można usunąć wiadomości.***`).then(replyMsg => {replyMsg.delete({timeout:2000})});
      console.error(err);
    });}
  };

  if(command === "say"){
    let text = args.join(" ");
    msg.delete();
    msg.channel.send(text);
};
};
}
  else return;
  });
  
//User commands  

client.on('message', msg => {
    /*
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
    */

    if (msg.content.startsWith(prefix) && !msg.author.bot)
    {
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "ping")
    {
        msg.reply('pong!');
    };

    if(command === "powiedz")
    {
      let text = args.join(" ");
      let user = msg.author.id;
      msg.delete();
      msg.channel.send(`Użytkownik <@${user}> napisał: ${text}`);
    };

    if(command === 'paulina')
    {
      msg.delete();
      msg.channel.send(`${client.emojis.cache.find(emoji => emoji.name === "popcornDS")} <@534774314369810454> **puścisz nam jakąś bajkę???** :pleading_face:`)
    };

    if(command === 'hania')
    {
      msg.delete();
      msg.channel.send(`${client.emojis.cache.find(emoji => emoji.name === "rusParrot")} <@590272661087584357> **давайте сделаем чат более славянским.**`)
    };

    if(command === 'szymon')
    {
      msg.delete();
      msg.channel.send(`${client.emojis.cache.find(emoji => emoji.name === "heygif")} <@332213072280289283> **to bardzo dobry kolega! :heart: (i mój beta tester! :heart_eyes:)**`)
    };

    if(command === 'majka')
    {
      msg.delete();
      msg.channel.send(`${client.emojis.cache.find(emoji => emoji.name === 'pepeKing')} <@563398605159792642> **to *TOTALNY* szefc** :heart: :heart_eyes_cat:`)
    };

    if(command === 'author')
    {
      msg.delete();
      msg.channel.send(`**${client.emojis.cache.find(emoji => emoji.name === "wumpusHype")} Autorem tego bota jest <@339111873641447424> Typ ma niezłą psychę, że mu się chciało! (serio, byłem momentami nieznośny i co chwilę wywalałem mu error do konsoli :))))**`)
    };

    if(command === 'klik')
    {
      msg.delete();
      msg.channel.send(`${client.emojis.cache.find(emoji => emoji.name === 'wumpusKeySlam')}`)
    };

    if(command === 'dance')
    {
      msg.delete();
      msg.channel.send(`${client.emojis.cache.find(emoji => emoji.name === 'wumpusDisco')}${client.emojis.cache.find(emoji => emoji.name === 'wumpusDisco')}${client.emojis.cache.find(emoji => emoji.name === 'wumpusDisco')}`)
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
              let obrazek = responseFinal.images.fixed_height.url;
              msg.channel.send({embed: {
                color: 10181046,
                title: `**Oto twój losowy gif zawierający: ${args}!**`,
                image: {url: obrazek},
                footer: {
                  text: "© Scout Robot 2020"
                },
                }}
              );
                          }).catch(() => {
                  msg.channel.send('O nie! Wystąpił błąd przy wczytywaniu GIFa :sob:');
              });
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
      if (member.user.id === '339111873641447424')
      {
      msg.channel.send(`<@${member.user.id}>` + "** posiada 200 IQ!**").catch(() => {
      msg.channel.send('O nie! Wystąpił błąd przy wczytywaniu GIFa :sob:');
      })  
      }
      else
      {var iq = randomInt(-200, 200);
      msg.channel.send(`<@${member.user.id}>` + "** posiada **" + iq + "** IQ!**").catch(() => {
          msg.channel.send('O nie! Wystąpił błąd przy wczytywaniu GIFa :sob:');
      }) } 
    };

    if(command === '.iq')
    {
      if (!msg.mentions.users.size) {
          return msg.reply('Oznacz prawidłowego użytkownika!');
      }
      let member = msg.mentions.members.first();
      msg.delete();     
      msg.channel.send(`<@${member.user.id}>` + "** posiada 200 IQ!**").catch(() => {
      msg.channel.send('O nie! Wystąpił błąd przy wczytywaniu GIFa :sob:');
      })  
      
    };

    if(command === 'help') {
      msg.channel.send({embed: {
       color: 10181046,
       title:`${client.emojis.cache.get("715457208896323604")}**Komendy harcBOT'a**${client.emojis.cache.get("715457208896323604")}`,
       description: "**Lista komend dostępnych dla każdego użytkownika**",
       fields: [{
           name: "**KOMENDY**",
           value: `${prefix}help - *wyświetla listę komend*
           ${prefix}gif <tematyka gifa - *wyświetla losowy gif (temat musi być w języku angielskim)*
           ${prefix}iq <@nick> - *generuje losowe IQ użytkownika*
           ${prefix}powiedz - *BOT napisze Twoją wiadomość.*`
         }
       ],
       footer: {
         text: "© Scout Robot 2020"
       }
       }})
   };
  }
  
});

client.login(config.token);