const { 
    Events,
    EmbedBuilder
} = require('discord.js');

const config = require('../config.json');

module.exports = {
        EventName: Events.GuildMemberRemove,
        async startAsync(member) {
            const LeaveEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`👋 ${member.user.displayName} has left the server !`)
                .setThumbnail(member.user.avatarURL())
                .setDescription(`### <@${member.user.id}> has left Honte-Hosting Discord !\n\n> 🛫 **»** We hope they'll come back! 😊`)
                .setImage("https://cdn.discordapp.com/attachments/857714045251878972/1145712624454094988/IMG_2818.gif?ex=65770f87&is=65649a87&hm=4ffec1c7814fc48d690266be210aa5bdcd8e35be2f32350a08008962a555887d&")
                .setFooter({
                    text: 'Honte-Hosting Bot',
                    iconURL: member.client.user.avatarURL()
                }).setTimestamp();
            member.client.channels.cache.get(config['HHWelcome']['welcomeChannel']).send({ embeds: [ LeaveEmbed ]});
        }
    };