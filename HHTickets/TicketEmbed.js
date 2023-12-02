const { 
    Events,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder
} = require('discord.js');

const config = require('../config.json');

module.exports = {
    EventName: Events.MessageCreate,
    async startAsync(message) {
        if(message.content === "!ticket_embed_spawn" && message.author.id === config['owner_id']) {
            message.delete();

            const TicketEmbed = new EmbedBuilder()
                .setColor('Purple')
                .setAuthor({
                    iconURL: "https://cdn.discordapp.com/attachments/1180451763464196096/1180565847727673385/HHLogo.png",
                    name:    "Honte-Hosting Bot"
                })
                .setTitle("Welcome to our ticket panel !")
                .setDescription("> Simply open the scrolling menu, ⬇️\n> and choose the corresponding category. 😋")
                .setThumbnail("https://cdn.discordapp.com/attachments/1180451763464196096/1180565847727673385/HHLogo.png")
                .setImage("https://cdn.discordapp.com/attachments/1180451763464196096/1180581942178107555/HHBanniere.png")
                .setTimestamp()
                .setFooter({
                  text: 'Honte-Hosting Bot',
                  iconURL: 'https://cdn.discordapp.com/icons/1171973658399481866/80b05c8d7ee5db4bb1f8912487a5d5dd.png',
                });

            const TicketSelectMenu = new StringSelectMenuBuilder()
                .setCustomId("HHTickets_TicketMenu")
                .setPlaceholder("Select a category that fits you.")
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Sales and billing support")
                        .setDescription("Any purchase/billing/other questions you have related to Honte-Hosting.")
                        .setEmoji("💵")
                        .setValue("HHTickets_TicketMenu_Option_1"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Web Hosting Support")
                        .setDescription("Support with your Honte-Hosting Web server.")
                        .setEmoji("🌐")
                        .setValue("HHTickets_TicketMenu_Option_2"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Games Support")
                        .setDescription("Support for your Honte-Hosting server.")
                        .setEmoji("🎮")
                        .setValue("HHTickets_TicketMenu_Option_3"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Applications Support")
                        .setDescription("Support for your Honte-Hosting App (NodeJS, Python... etc).")
                        .setEmoji("🐍")
                        .setValue("HHTickets_TicketMenu_Option_4"),
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Other")
                        .setDescription("Can't find the right support department? Use this and we'll send you to the correct place!")
                        .setEmoji("❓")
                        .setValue("HHTickets_TicketMenu_Option_5")
                );

            message.channel.send({
                embeds: [ TicketEmbed ],
                components: [ new ActionRowBuilder().addComponents(TicketSelectMenu) ]
            });
        };
    }
};