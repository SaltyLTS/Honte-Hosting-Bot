const {
    Events,
    EmbedBuilder,
    ChannelType
} = require('discord.js');

const config = require('../config.json');

module.exports = {
    EventName: Events.MessageCreate,
    async startAsync(message) {
        if(message.channel.id === config['HHSuggestions']['suggestionChannel']) {
            if(message.author.bot) return;
    
            let SuggestEmbed = new EmbedBuilder()
                .setColor('Random')
                .setAuthor({
                    name: `Suggestion from ${message.author.tag} (${message.author.id})`,
                    iconURL: message.author.avatarURL()
                })
                .setFooter({
                    text: 'Honte-Hosting Bot',
                    iconURL: message.client.user.avatarURL()
                })
                .setDescription(message.content)
                .setTimestamp(Date.now());
    
            message.channel.send({ embeds: [ SuggestEmbed ]}).then(suggest => {
                suggest.react('✅');
                suggest.react('❌');
    
                suggest.startThread({
                    name: 'Thread about the suggestion',
                    type: ChannelType.PublicThread
                });
    
                message.delete();
            });
        };
    }
};