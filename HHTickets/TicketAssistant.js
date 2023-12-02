const { 
    Events,
    PermissionsBitField,
    EmbedBuilder,
    ButtonStyle,
    ButtonBuilder,
    ActionRowBuilder
} = require('discord.js');

const { HHTickets } = require('./HHTickets.js');
const LogsManager       = require('./LogsManager.js');
const config            = require('../config.json');

module.exports = {
    EventName: Events.InteractionCreate,
    async startAsync(interaction) {
        if(interaction.isButton()) {
            if(
                interaction.customId === "HHTickets_Assistant_Delete" ||
                interaction.customId === "HHTickets_Assistant_ReOpen" ||
                interaction.customId === "HHTickets_Assistant_Transcript" ||
                interaction.customId === "HHTickets_Assistant_Delete_Verify" ||
                interaction.customId === "HHTickets_Assistant_ReClose"
            ) {
                let isTicket = await HHTickets.findOne({ where: { channel_id: interaction.channel.id } });
    
                if (isTicket) {
                    switch(interaction.customId) {
                        case "HHTickets_Assistant_Delete":
                            if(!interaction.member.roles.cache.some(role => config['HHTickets']['staffRoles'].includes(role.id))) return interaction.reply({ content: `<@${interaction.member.user.id}> You do not have necessery permissions for this action.` });
    
                            let TicketDeleteEmbed = new EmbedBuilder()
                                .setColor('Red')
                                .setDescription("Are you sure you want to delete this ticket?\nThis action is irreversible.");
    
                            let TicketDeleteRow = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("HHTickets_Assistant_Delete_Verify")
                                        .setLabel("Delete definitely")
                                        .setStyle(ButtonStyle.Danger)
                                        .setEmoji("⛔")
                                )
    
                            interaction.reply({ embeds: [ TicketDeleteEmbed ], components: [ TicketDeleteRow ], ephemeral: true });
    
                            break;
                        case "HHTickets_Assistant_Delete_Verify":
                            interaction.guild.channels.cache.get(isTicket.channel_id).delete().then(async() => {
                                new LogsManager('Delete', interaction.member.user, {
                                    channel_id: isTicket.channel_id,
                                    number: ("0000" + (isTicket.id)).slice(-4),
                                    timestamp: Date.now()
                                }).SendLogs();
    
                                await isTicket.destroy();
                            });
                            break;
                        case "HHTickets_Assistant_ReOpen":
                            if(!interaction.member.roles.cache.some(role => config['HHTickets']['staffRoles'].includes(role.id))) return interaction.reply({ content: `<@${interaction.member.user.id}> You do not have necessery permissions for this action.` });
    
                            try {
                                const AllDeny = [{ id: isTicket.author_id, allow: [ PermissionsBitField.Flags.ViewChannel ] }, { id: interaction.guild.id, deny: [ PermissionsBitField.Flags.ViewChannel ] }];
        
                                if(JSON.parse(isTicket.invited_id).length > 0) {
                                    JSON.parse(isTicket.invited_id).forEach(element => {
                                        AllDeny.push(
                                            {
                                                id: element,
                                                allow: [
                                                    PermissionsBitField.Flags.ViewChannel
                                                ]
                                            }
                                        )
                                    });
                                };

                                config['HHTickets']['staffRoles'].forEach(element => {
                                    AllDeny.push({
                                        id: element,
                                        allow: [
                                            PermissionsBitField.Flags.ViewChannel
                                        ]
                                    });
                                });
    
                                interaction.guild.channels.cache.get(isTicket.channel_id).permissionOverwrites.set(AllDeny).then(async() => {
                                    await interaction.channel.messages.fetch(isTicket.ticketControls_id).then(i => {
                                        const NewRow = new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setCustomId(i.components[0].components[0].data.custom_id)
                                                    .setLabel(i.components[0].components[0].data.label)
                                                    .setStyle(i.components[0].components[0].data.style)
                                                    .setEmoji(i.components[0].components[0].data.emoji ? i.components[0].components[0].data.emoji.name : "📄")
                                                    .setDisabled(i.components[0].components[0].data.disabled ? true : false),
                                                new ButtonBuilder()
                                                    .setCustomId("HHTickets_Assistant_ReClose")
                                                    .setLabel("Re-fermé")
                                                    .setStyle(i.components[0].components[1].data.style)
                                                    .setEmoji("🔒")
                                                    .setDisabled(false),
                                                new ButtonBuilder()
                                                    .setCustomId(i.components[0].components[2].data.custom_id)
                                                    .setLabel(i.components[0].components[2].data.label)
                                                    .setStyle(i.components[0].components[2].data.style)
                                                    .setEmoji(i.components[0].components[2].data.emoji ? i.components[0].components[2].data.emoji.name : "⛔")
                                                    .setDisabled(i.components[0].components[2].data.disabled ? true : false) 
                                            );
                
                                        i.edit({ components: [ NewRow ] }).then(() => {
                                            let TicketReOpenEmbed = new EmbedBuilder()
                                                .setColor('Yellow')
                                                .setDescription(`**This ticket has been re-opened by <@${interaction.member.user.id}>**`);
    
                                            interaction.reply({ embeds: [ TicketReOpenEmbed ] });
                                            isTicket.update({ reOpener_id: interaction.member.user.id, reOpenedAt: Date.now() }).then(_TicketDB => {
                                                new LogsManager('ReOpen', interaction.member.user, {
                                                    channel_id: _TicketDB.channel_id,
                                                    number: ("0000" + (_TicketDB.id)).slice(-4),
                                                    timestamp: _TicketDB.reOpenedAt
                                                }).SendLogs();
                                            });
                                        });
                                    });
                                });
                            } catch (err) {
                                console.log(err);
                            }
                            
                            break;
                        case "HHTickets_Assistant_ReClose":
                            if(!interaction.member.roles.cache.some(role => config['HHTickets']['staffRoles'].includes(role.id))) return interaction.reply({ content: `<@${interaction.member.user.id}> You do not have necessery permissions for this action.` });
    
                            try {
                                const AllDeny = [{ id: isTicket.author_id, deny: [ PermissionsBitField.Flags.ViewChannel ] }, { id: interaction.guild.id, deny: [ PermissionsBitField.Flags.ViewChannel ] }];
        
                                if(JSON.parse(isTicket.invited_id).length > 0) {
                                    JSON.parse(isTicket.invited_id).forEach(element => {
                                        AllDeny.push(
                                            {
                                                id: element,
                                                deny: [
                                                    PermissionsBitField.Flags.ViewChannel
                                                ]
                                            }
                                        )
                                    });
                                };

                                config['HHTickets']['staffRoles'].forEach(element => {
                                    AllDeny.push({
                                        id: element,
                                        allow: [
                                            PermissionsBitField.Flags.ViewChannel
                                        ]
                                    });
                                });
    
                                interaction.guild.channels.cache.get(isTicket.channel_id).permissionOverwrites.set(AllDeny).then(async() => {
                                    await interaction.channel.messages.fetch(isTicket.ticketControls_id).then(i => {
                                        const NewRow = new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setCustomId(i.components[0].components[0].data.custom_id)
                                                    .setLabel(i.components[0].components[0].data.label)
                                                    .setStyle(i.components[0].components[0].data.style)
                                                    .setEmoji(i.components[0].components[0].data.emoji ? i.components[0].components[0].data.emoji.name : "📄")
                                                    .setDisabled(i.components[0].components[0].data.disabled ? true : false),
                                                new ButtonBuilder()
                                                    .setCustomId("HHTickets_Assistant_ReOpen")
                                                    .setLabel("Re-open")
                                                    .setStyle(i.components[0].components[1].data.style)
                                                    .setEmoji("🔓")
                                                    .setDisabled(false),
                                                new ButtonBuilder()
                                                    .setCustomId(i.components[0].components[2].data.custom_id)
                                                    .setLabel(i.components[0].components[2].data.label)
                                                    .setStyle(i.components[0].components[2].data.style)
                                                    .setEmoji(i.components[0].components[2].data.emoji ? i.components[0].components[2].data.emoji.name : "⛔")
                                                    .setDisabled(i.components[0].components[2].data.disabled ? true : false) 
                                            );
                
                                        i.edit({ components: [ NewRow ] }).then(() => {
                                            let TicketReCloseEmbed = new EmbedBuilder()
                                                .setColor('Red')
                                                .setDescription(`**This ticket has been re-closed by <@${interaction.member.user.id}>**`);
    
                                            interaction.reply({ embeds: [ TicketReCloseEmbed ] });
                                            isTicket.update({ closer_id: interaction.member.user.id, closedAt: Date.now() }).then(_TicketDB => {
                                                new LogsManager('ReClose', interaction.member.user, {
                                                    channel_id: _TicketDB.channel_id,
                                                    number: ("0000" + (_TicketDB.id)).slice(-4),
                                                    timestamp: _TicketDB.closedAt
                                                }).SendLogs();
                                            });
                                        });
                                    });
                                });
                            } catch (err) {
                                console.log(err);
                            }
                            
                            break;
                        case "HHTickets_Assistant_Transcript":
                            /*
                                TRANSCRIPT SOON...
                            */
                            break;
                    }
                } else {
                    return interaction.reply("Ticket introuvable.");
                };
            };
        };
    }
};