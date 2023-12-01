const {Client, IntentsBitField, EmbedBuilder} = require('discord.js');
const ping = require('ping');
const dotenv = require('dotenv');
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],
});

dotenv.config();

const hosts = [
    'hontehosting.com',
    'panel.hontehosting.com',
    'client.hontehosting.com',
    'pma.hontehosting.com',
    'fin-1.hontehosting.com',
    'db-1.hontehosting.com',
  ];

  const channelId = '1178103564778881176'; // Replace with your channel ID
  
  client.once('ready', async () => {
    console.log(`Bot prêt. [PTERO] \nConnecté en tant que ${client.user.tag}`);
    dzqdqzdqz
    try {
      const channel = client.channels.cache.get(channelId);
  
      if (!channel) {
        console.error(`Channel with ID ${channelId} not found`);
        return;
      }
  
      let sentMessage;
  
      // Auto-edit the embed every 10 seconds
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
        for (const host of hosts.slice(0, 4)) {
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
  
        // Additional fields for Nodes and Databases
        const nodes = hosts.slice(4, 5);
        const databases = hosts.slice(5, 6);
  
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
  
        if (!sentMessage) {
            // Send the embed initially
            sentMessage = await channel.send({ embeds: [embed] });
          } else {
            // Edit the existing message with the updated embed
            await sentMessage.edit({ embeds: [embed] });
          }
        } catch (autoEditError) {
          console.error('Error during auto-edit:', autoEditError);
        }
      }, 10000);
  
    } catch (error) {
      console.error('General error:', error);
    }
  });

client.login(process.env.TOKEN);