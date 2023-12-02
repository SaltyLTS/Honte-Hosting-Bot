const { 
    Events,
    ChannelType,
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
            if(
                interaction.customId === "HHTickets_TicketModal_1" ||
                interaction.customId === "HHTickets_TicketModal_2" ||
                interaction.customId === "HHTickets_TicketModal_3" ||
                interaction.customId === "HHTickets_TicketModal_4" ||
                interaction.customId === "HHTickets_TicketModal_5"
            ) {
                let ModalSubmit = interaction.customId.split("_");

                interaction.deferReply({ ephemeral: true }).then(async _i => {
                    let isTicket = await HHTickets.create({
                        author_id: interaction.member.user.id
                    });

                    let permissionOverwrites = [
                        {
                            id: interaction.member.user.id,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel
                            ]
                        },
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [
                                PermissionsBitField.Flags.ViewChannel
                            ]
                        }
                    ];

                    config['HHTickets']['staffRoles'].forEach(element => {
                        permissionOverwrites.push({
                            id: element,
                            allow: [
                                PermissionsBitField.Flags.ViewChannel
                            ]
                        });
                    });

                    interaction.guild.channels.create({
                        name: interaction.member.user.username + "-" + ("0000" + isTicket.id).slice(-4),
                        parent: config['HHTickets']['ticketCategory'],
                        type: ChannelType.GuildText,
                        permissionOverwrites: permissionOverwrites
                    }).then(async newTicket => {
                        const TicketMessageEmbed = new EmbedBuilder()
                            .setAuthor({
                                name: "Honte-Hosting Support",
                                iconURL: "https://cdn.discordapp.com/icons/1171973658399481866/80b05c8d7ee5db4bb1f8912487a5d5dd.png",
                            })
                            .setTitle("Honte-Hosting Tickets")
                            .setDescription(`Hi <@${interaction.member.user.id}>. A staff will come to you as soon as possible.`)
                            .setImage("https://cdn.discordapp.com/attachments/1180451763464196096/1180581942178107555/HHBanniere.png")
                            .setColor('White');
        
                        switch(ModalSubmit[ModalSubmit.length - 1]) {
                            case "1":
                                TicketMessageEmbed.addFields(
                                    {
                                        name: "Sales and billing support",
                                        value: `\`\`\`\n${interaction.fields.getTextInputValue("HHTickets_TicketModal_Option_1")}\n\`\`\``,
                                    },
                                    {
                                        name: "Any purchase/billing/other questions you have related to Honte-Hosting.",
                                        value: `\`\`\`\n${interaction.fields.getTextInputValue("HHTickets_TicketModal_Option_2")}\n\`\`\``,
                                    },
                                )
                                break;
                            case "2":
                                TicketMessageEmbed.addFields(
                                    {
                                        name: "Web Hosting Support",
                                        value: `\`\`\`\n${interaction.fields.getTextInputValue("HHTickets_TicketModal_Option_1")}\n\`\`\``,
                                    },
                                    {
                                        name: "Support with your Honte-Hosting Web server.",
                                        value: `\`\`\`\n${interaction.fields.getTextInputValue("HHTickets_TicketModal_Option_2")}\n\`\`\``,
                                    },
                                )
                                break;
                            case "3":
                                TicketMessageEmbed.addFields(
                                    {
                                        name: "Games Support",
                                        value: `\`\`\`\n${interaction.fields.getTextInputValue("HHTickets_TicketModal_Option_1")}\n\`\`\``,
                                    },
                                    {
                                        name: "Support for your Honte-Hosting server.",
                                        value: `\`\`\`\n${interaction.fields.getTextInputValue("HHTickets_TicketModal_Option_2")}\n\`\`\``,
                                    },
                                )
                                break;
                            case "4":
                                TicketMessageEmbed.addFields(
                                    {
                                        name: "Applications Support",
                                        value: `\`\`\`\n${interaction.fields.getTextInputValue("HHTickets_TicketModal_Option_1")}\n\`\`\``,
                                    },
                                    {
                                        name: "Support for your Honte-Hosting App (NodeJS, Python... etc).",
                                        value: `\`\`\`\n${interaction.fields.getTextInputValue("HHTickets_TicketModal_Option_2")}\n\`\`\``,
                                    },
                                )
                                break;
                            case "5":
                                TicketMessageEmbed.addFields(
                                    {
                                        name: "Other",
                                        value: `\`\`\`\n${interaction.fields.getTextInputValue("HHTickets_TicketModal_Option_1")}\n\`\`\``,
                                    },
                                    {
                                        name: "Can't find the right support department? Use this and we'll send you to the correct place!",
                                        value: `\`\`\`\n${interaction.fields.getTextInputValue("HHTickets_TicketModal_Option_2")}\n\`\`\``,
                                    },
                                )
                                break;
                        };
        
                        const TicketMessageButton_Claim = new ButtonBuilder()
                            .setCustomId('HHTickets_ClaimButton')
                            .setLabel("🙋‍♂️ Claim the ticket")
                            .setStyle(ButtonStyle.Success);
        
                        const TicketMessageButton_Close = new ButtonBuilder()
                            .setCustomId('HHTickets_CloseButton')
                            .setLabel("🔒 Close the ticket")
                            .setStyle(ButtonStyle.Danger);
        
                        const TicketMessageRow = new ActionRowBuilder()
                            .addComponents(TicketMessageButton_Close, TicketMessageButton_Claim);
        
                        newTicket.send({
                            embeds: [
                                TicketMessageEmbed
                            ],
                            components: [
                                TicketMessageRow
                            ]
                        }).then(async ticketMessage => {
                            await isTicket.update({
                                channel_id: newTicket.id,
                                message_id: ticketMessage.id,
                                author_id: interaction.member.user.id,
                                createdAt: Date.now()
                            }).then((_TicketDB) => {
                                new LogsManager('Create', interaction.member.user, {
                                    channel_id: _TicketDB.channel_id,
                                    number: ("0000" + (_TicketDB.id)).slice(-4),
                                    type: ModalSubmit[ModalSubmit.length - 1],
                                    timestamp: _TicketDB.createdAt
                                }).SendLogs();
                            });
                        });
                        
                        _i.edit(`Your ticket has been created! <#${newTicket.id}>`);
                    }).catch(() => {
                        _i.edit("An error has occured while creating your ticket. Please, contact a staff member.")
                    });
                });
            };
        };
    }
};