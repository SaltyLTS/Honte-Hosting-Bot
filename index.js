const {Client, IntentsBitField, EmbedBuilder, Routes, REST} = require('discord.js');
const ping = require('ping');
const dotenv = require('dotenv');
const Sequelize = require('sequelize');
const { fetchAndSendEmails } = require('./HHMail/mail');
const client = new Client({

	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences
	],
});

dotenv.config();

const imapConfig = {
  user: process.env.MAILUSER,
  password: process.env.MAILPASS, 
  host: process.env.MAILHOST,
  port: process.env.MAILPORT,
  tls: process.env.TLS,
};

const HHDatabase = new Sequelize.Sequelize('HH_Bot', 'root', '', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'HH_Database.db'
});

module.exports.HHDatabase = HHDatabase;

const { HHTickets } = require('./HHTickets/HHTickets.js');

HHTickets.sync();

const hosts = [
  'hontehosting.com',
  'panel.hontehosting.com',
  'client.hontehosting.com',
  'pma.hontehosting.com',
  'docs.hontehosting.com',
  'fin-1.hontehosting.com',
  'db-1.hontehosting.com',
];

const channelId = process.env.CHANNELID;

client.once('ready', async () => {
  console.log(`Bot prêt. [PTERO] \nConnecté en tant que ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  (async () => {
      try {
          await rest.put(Routes.applicationCommands(client.user.id),
              { body: client.commands, }
          );

          console.log("Commandes chargées sans problèmes.");
      } catch(e) {
          console.log(e);
      }
  })(); 

  try {
    const channel = client.channels.cache.get(channelId);

    if (!channel) {
      console.error(`Channel with ID ${channelId} not found`);
      return;
    }

    let sentMessage;

    setInterval(async () => {
      try {
        const embed = new EmbedBuilder()
        .setColor('Purple')
        .setTitle(`Honte-Hosting Systems Status`)
        .setThumbnail(
          'https://cdn.discordapp.com/icons/1171973658399481866/80b05c8d7ee5db4bb1f8912487a5d5dd.png?size=4096'
        )
        .setTimestamp()
        .setFooter({
          text: 'Honte-Hosting Bot',
          iconURL: 'https://cdn.discordapp.com/icons/1171973658399481866/80b05c8d7ee5db4bb1f8912487a5d5dd.png',
        });

        let mainDescription = '**—————————————————————**\n•  Main | Panel | Dashboard | PhpMyAdmin  •\n\n';
        for (const host of hosts.slice(0, 5)) {
          try {
            const result = await ping.promise.probe(host);
            mainDescription += `**»** [${host}](https://${host}) **-** ${
              result.alive ? `<a:online:1179082103888040077>` : `<a:offline:1179082137895456820>`
            } ${result.alive ? `\`(${result.time}ms)\`` : `\`(OFF)\``}\n`;
          } catch (pingError) {
            console.error(`Error while pinging ${host}:`, pingError);
            mainDescription += `\`${host}\` - Error while pinging: ${pingError}\n`;
          }
        }

        embed.setDescription(mainDescription);
        const nodes = hosts.slice(5, 6);
        const databases = hosts.slice(6, 7);

        try {
          const nodeResult = await ping.promise.probe(nodes[0]);
          embed.addFields({
            name: 'Nodes',
            value: `**»** [Fin-1](https://fin-1.hontehosting.com) **-** ${nodeResult.alive ? `<a:online:1179082103888040077>` : `<a:offline:1179082137895456820>`} ${
              nodeResult.alive ? `\`(${nodeResult.time}ms)\`` : `\`(OFF)\``
            }\n`,
            inline: true,
          });
        } catch (nodeError) {   
          console.error('Error while pinging Node:', nodeError);
          embed.addFields({
            name: 'Nodes',
            value: `Error while pinging Node: ${nodeError}`,
            inline: true,
          });
        }

        try {
          const dbResult = await ping.promise.probe(databases[0]);
          embed.addFields({
            name: 'Databases',
            value: `**»** [Db-1](https://db-1.hontehosting.com) **-** ${dbResult.alive ? `<a:online:1179082103888040077>` : `<a:offline:1179082137895456820>`} ${
            dbResult.alive ? `\`(${dbResult.time}ms)\`` : `\`(OFF)\``
            }\n`,
            inline: true,
          });
        } catch (dbError) {
          console.error('Error while pinging Database:', dbError);
          embed.addFields({
            name: 'Databases',
            value: `Error while pinging Database: ${dbError}`,
            inline: true,
          });
        }

        const Embedxdxd = channel.messages.fetch("1180551369141276823").then(lastMessage => {

          if (!lastMessage) {
            lastMessage = channel.send({ embeds: [embed] });
          } else {
            lastMessage.edit({ embeds: [embed] });
          }
        });
      } catch (error) {
        console.error('General error:', error);
      }
    }, 10000);

    setInterval(() => {
      fetchAndSendEmails(imapConfig, process.env.WEBHOOK);
    }, 300000);
    
  } catch (error) {
    console.error('General error:', error);
  }
});

///////////////////
//               //
// HHTickets //
//               //
///////////////////

const TicketEmbed     = require('./HHTickets/TicketEmbed.js');
const TicketMenu      = require('./HHTickets/TicketMenu.js');
const TicketModal     = require('./HHTickets/TicketModal.js');
const TicketMessage   = require('./HHTickets/TicketMessage.js');
const TicketClose     = require('./HHTickets/TicketClose.js');
const TicketAssistant = require('./HHTickets/TicketAssistant.js');
const TicketCommands  = require('./HHTickets/TicketCommands.js');
const tDefineCommands = require('./HHTickets/DefineCommands.js');

client.on(TicketEmbed.EventName,     (...args) => TicketEmbed.startAsync(...args));
client.on(TicketMenu.EventName,      (...args) => TicketMenu.startAsync(...args));
client.on(TicketModal.EventName,     (...args) => TicketModal.startAsync(...args));
client.on(TicketMessage.EventName,   (...args) => TicketMessage.startAsync(...args));
client.on(TicketClose.EventName,     (...args) => TicketClose.startAsync(...args));
client.on(TicketAssistant.EventName, (...args) => TicketAssistant.startAsync(...args));
client.on(TicketCommands.EventName,  (...args) => TicketCommands.startAsync(...args));
client.on(tDefineCommands.EventName, (...args) => tDefineCommands.startAsync(...args));

///////////////////////
//                   //
// HHSuggestions     //
//                   //
///////////////////////

const SuggestionCreate  = require('./HHSuggestions/SuggestionCreate.js');
const SuggestionManager = require('./HHSuggestions/SuggestionManager.js');
const sDefineCommands   = require('./HHSuggestions/DefineCommands.js');

client.on(SuggestionCreate.EventName,  (...args) => SuggestionCreate.startAsync(...args));
client.on(SuggestionManager.EventName, (...args) => SuggestionManager.startAsync(...args));
client.on(sDefineCommands.EventName,   (...args) => sDefineCommands.startAsync(...args));

///////////////////
//               //
// HHWelcome     //
//               //
///////////////////

const WelcomeMessage = require('./HHWelcome/WelcomeMessage.js');
client.on(WelcomeMessage.EventName, (...args) => WelcomeMessage.startAsync(...args));
const LeftMessage = require('./HHWelcome/LeftMessage.js');
client.on(LeftMessage.EventName, (...args) => LeftMessage.startAsync(...args));

//////////////////
//              //
// HHStatus     //
//              //
//////////////////

const StatusPresence = require('./HHStatus/StatusPresence.js');
client.on(StatusPresence.EventName, (...args) => StatusPresence.startAsync(...args));
const StatsDocks = require('./HHStatus/StatsDocks.js');
client.on(StatsDocks.EventName, (...args) => StatsDocks.startAsync(...args));


client.login(process.env.TOKEN);
