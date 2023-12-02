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
        if(interaction.isModalSubmit()) {
            if(interaction.customId === "HHTickets_TicketModal_Close") {
                let isTicket = await HHTickets.findOne({ where: { channel_id: interaction.channel.id } });
    
                if (isTicket) {
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
                            await interaction.channel.messages.fetch(isTicket.message_id).then(i => {
                                const NewRow = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId(i.components[0].components[0].data.custom_id)
                                            .setLabel(i.components[0].components[0].data.label)
                                            .setStyle(i.components[0].components[0].data.style)
                                            .setDisabled(true), // true
                                        new ButtonBuilder()
                                            .setCustomId(i.components[0].components[1].data.custom_id)
                                            .setLabel(i.components[0].components[1].data.label)
                                            .setStyle(i.components[0].components[1].data.style)
                                            .setDisabled(true) // true 
                                    );
        
                                i.edit({ components: [ NewRow ] }).then(() => {
                                    let TicketClosedEmbed = new EmbedBuilder()
                                        .setColor('Yellow')
                                        /*.setAuthor(
                                            {
                                                name: `Ticket fermé`,
                                                iconURL: interaction.member.user.avatarURL()
                                            }
                                        ) ??? */
                                        .setDescription(`**This ticket has been closed by <@${interaction.member.user.id}>**`)
                                        .addFields(
                                            {
                                                name: "Closure reason:",
                                                value: interaction.fields.getTextInputValue("HHTickets_TicketModal_Close_Option_1")
                                            }
                                        );
    
                                    interaction.reply({ embeds: [ TicketClosedEmbed ] }).then(() => {
                                        let TicketDeleteEmbed = new EmbedBuilder()
                                            .setColor("DarkButNotBlack")
                                            .setDescription("```Ticket Assistance```");
    
                                        let TicketDeleteRow = new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setCustomId("HHTickets_Assistant_Transcript")
                                                    .setLabel("Transcript")
                                                    .setStyle(ButtonStyle.Secondary)
                                                    .setEmoji("📄")
                                                    .setDisabled(true),
                                                new ButtonBuilder()
                                                    .setCustomId("HHTickets_Assistant_ReOpen")
                                                    .setLabel("Re-open")
                                                    .setStyle(ButtonStyle.Secondary)
                                                    .setEmoji("🔓")
                                                    .setDisabled(false),
                                                new ButtonBuilder()
                                                    .setCustomId("HHTickets_Assistant_Delete")
                                                    .setLabel("Delete")
                                                    .setStyle(ButtonStyle.Secondary)
                                                    .setEmoji("⛔"),
                                            )
    
                                        interaction.channel.send({ embeds: [ TicketDeleteEmbed ], components: [ TicketDeleteRow ]}).then(_ticketControls => {
                                            isTicket.update({ closedAt: Date.now(), closer_id: interaction.member.user.id, closeReason: interaction.fields.getTextInputValue("HHTickets_TicketModal_Close_Option_1"), ticketControls_id: _ticketControls.id }).then(_TicketDB => {
                                                new LogsManager('Close', interaction.member.user, {
                                                    channel_id: _TicketDB.channel_id,
                                                    number: ("0000" + (_TicketDB.id)).slice(-4),
                                                    timestamp: _TicketDB.closedAt,
                                                    reason: _TicketDB.closeReason
                                                }).SendLogs();
                                            });
                                        });
                                    });
                                });
                            }).catch(() => {
                                return interaction.reply("Ticket not found.");
                            });
                        }).catch((err) => {
                            console.log(isTicket.author_id);
                            console.log(err);
                        });
                    } catch (error) {
                        console.log(error);
                    };
                    
                } else {
                    return interaction.reply("Ticket not found.");
                };
            };
        };
    }
};