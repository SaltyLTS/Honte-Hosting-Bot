const { 
    Events,
    ModalBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

const { HHTickets } = require('./HHTickets.js');
const LogsManager       = require('./LogsManager.js');
const config            = require('../config.json');

module.exports = {
    EventName: Events.InteractionCreate,
    async startAsync(interaction) {
        if(interaction.isButton()) {
            let isTicket = await HHTickets.findOne({ where: { channel_id: interaction.channel.id } });

            if (isTicket) {
                switch(interaction.customId) {
                    case "HHTickets_ClaimButton":
                        if(!interaction.member.roles.cache.some(role => config['HHTickets']['staffRoles'].includes(role.id))) return interaction.reply({ content: `<@${interaction.member.user.id}> You do not have necessery permissions for this action.`, ephemeral: true });
    
                        await interaction.channel.messages.fetch(isTicket.message_id).then(i => {
                            const NewRow = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId(i.components[0].components[0].data.custom_id)
                                        .setLabel(i.components[0].components[0].data.label)
                                        .setStyle(i.components[0].components[0].data.style)
                                        .setDisabled(i.components[0].components[0].data.disabled ? true : false),
                                    new ButtonBuilder()
                                        .setCustomId(i.components[0].components[1].data.custom_id)
                                        .setLabel(i.components[0].components[1].data.label)
                                        .setStyle(i.components[0].components[1].data.style)
                                        .setDisabled(true) // true
                                );
    
                            i.edit({ components: [ NewRow ] }).then(() => {
                                interaction.reply(`<@${interaction.member.user.id}> has claimed the ticket.`).then(() => {
                                    isTicket.update({ claimer_id: interaction.member.user.id, claimedAt: Date.now() }).then(_TicketDB => {
                                        new LogsManager('Claim', interaction.member.user, {
                                            channel_id: _TicketDB.channel_id,
                                            number: ("0000" + (_TicketDB.id)).slice(-4),
                                            timestamp: _TicketDB.claimedAt
                                        }).SendLogs();
                                    });
                                });
                            });
                        }).catch(() => {
                            return interaction.reply("Ticket not found.");
                        });
        
                        break;
                    case "HHTickets_CloseButton":
                        let _isTicket = await HHTickets.findOne({ where: { channel_id: interaction.channel.id } });
    
                        if(interaction.member.roles.cache.some(role => config['HHTickets']['staffRoles'].includes(role.id)) || interaction.member.user.id === _isTicket.author_id) {
                            const CloseModal = new ModalBuilder()
                                .setCustomId("HHTickets_TicketModal_Close")
                                .setTitle("HHTickets - Form")
                                .addComponents(
                                    new ActionRowBuilder().addComponents(
                                        new TextInputBuilder()
                                            .setCustomId("HHTickets_TicketModal_Close_Option_1")
                                            .setPlaceholder("Ticket resolved.")
                                            .setMaxLength(256)
                                            .setStyle(TextInputStyle.Paragraph)
                                            .setLabel("Why do you want to close this ticket ?")
                                    )
                                );
                            
                            interaction.showModal(CloseModal)
                        } else {
                            return interaction.reply({ content: `<@${interaction.member.user.id}> You can not close this ticket.`, ephemeral: true });
                        };
                            
                        break;
                };
            } else {
                return interaction.reply("Ticket not found.");
            };
        };
    }
};