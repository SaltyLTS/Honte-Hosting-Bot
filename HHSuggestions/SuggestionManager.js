const {
    Events,
} = require('discord.js');

const config = require('../config.json');

module.exports = {
    EventName: Events.InteractionCreate,
    async startAsync(interaction) {
        if(interaction.isCommand()) {
            if(interaction.commandName.toLowerCase() === 'suggest') {
                if(!interaction.member.roles.cache.some(role => config['HHSuggestions']['staffRoles'].includes(role.id))) return interaction.reply({ content: `<@${interaction.member.user.id}> You don't have necessesary permissions for this action.`, ephemeral: true });
    
                switch(interaction.options.getSubcommand()) {
                    case "accept":
                        await interaction.guild.channels.cache.get(config['HHSuggestions']['suggestionChannel']).messages.fetch(interaction.options.getString('message_id')).then(i => {
                            interaction.member.send({ embeds: [ i.embeds[0] ]});
    
                            i.delete().then(() => {
                                interaction.guild.members.cache.get(i.embeds[0].data.author.name.split('(')[1].replace(')', '')).send('One of your suggestions has been accepted!');
                                
                                return interaction.reply({ content: `<@${interaction.member.user.id}> This suggestion has been accepted`, ephemeral: true });
                            }).catch(() => {
                                return interaction.reply({ content: `<@${interaction.member.user.id}> An error occured while deleting this suggestion. Please, call a staff.`, ephemeral: true });
                            });
                        }).catch(() => {
                            interaction.reply({ content: `<@${interaction.member.user.id}> This suggestion doesn't exist.`, ephemeral: true })
                        });
                    break;
                    case "refuse":
                        await interaction.guild.channels.cache.get(config['HHSuggestions']['suggestionChannel']).messages.fetch(interaction.options.getString('message_id')).then(i => {
                            i.delete().then(() => {
                                interaction.guild.members.cache.get(i.embeds[0].data.author.name.split('(')[1].replace(')', '')).send('One of your suggestions has been declined...');
                                
                                return interaction.reply({ content: `<@${interaction.member.user.id}> This suggestion has been declined`, ephemeral: true });
                            }).catch(() => {
                                return interaction.reply({ content: `<@${interaction.member.user.id}> An error occured while deleting this suggestion. Please, call a staff.`, ephemeral: true });
                            });
                        }).catch(() => {
                            interaction.reply({ content: `<@${interaction.member.user.id}> This suggestion doesn't exist.`, ephemeral: true })
                        });
                    break;
                };
            };
        };
    }
};