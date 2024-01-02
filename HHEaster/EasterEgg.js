const { Events, ChannelType } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    EventName: Events.MessageCreate,
    async startAsync(message) {
        if (message.channel.type === ChannelType.DM) {
            if (message.content === process.env.ANSWER) {
                const client = message.client;
                const guild = client.guilds.cache.get(process.env.GUILDID);
                const role = guild.roles.cache.get(process.env.EASTERID);
                const member = await guild.members.fetch(message.author.id);

                if (!guild || !role) {
                    console.error('Role or server not found');
                    return;
                }


                if (member.roles.cache.some(role => role.name === 'Easter Egg')) return message.reply('You already have the role !').then(msg => {
                    setTimeout(() => msg.delete(), 10000)
                });;

                try {
                    
                    await member.roles.add(role);
                    message.reply('Role added').then(msg => {
                        setTimeout(() => msg.delete(), 10000)
                    });

                    console.log(`Added role ${role.name} to ${message.author.tag}`);
                } catch (error) {
                    console.error("Error adding role:", error);
                }
            }
        }
    }
};