const { 
    Events,
    EmbedBuilder
} = require('discord.js');

const config = require('../config.json');

module.exports = {
        EventName: Events.GuildMemberAdd,
        async startAsync(member) {
            const WelcomeEmbed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(`🚶‍♂️ ${member.user.displayName} has joined the server !`)
                .setThumbnail(member.user.avatarURL())
                .setDescription(`### Welcome to Honte-Hosting Discord !\n\n> 📙 **»** If you need help, open a ticket: \n<#1179550953813319753>\n> 📢 **»** Check our announcements: \n<#1178103563629637692>\n> ⚙️ **»** Check our systems status: \n<#1180455637025554522>`)
                .setImage("https://krypteiagroup.com/wp-content/uploads/2022/04/krypteia-group-website-design-and-hosting-page-header-image.jpg")
                .setFooter({
                    text: 'Honte-Hosting Bot',
                    iconURL: member.client.user.avatarURL()
                }).setTimestamp();

            member.client.channels.cache.get(config['HHWelcome']['welcomeChannel']).send({ embeds: [ WelcomeEmbed ]});
        },

    };