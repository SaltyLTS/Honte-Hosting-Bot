const { EmbedBuilder, WebhookClient, Embed } = require('discord.js');
const config                                 = require('../config.json');

class LogsManager {
    constructor(type, author, ticket) {
        this.type   = type;
        this.author = author;
        this.ticket = ticket;

        this.TicketType = [
            "Create",
            "MemberAdd",
            "MemberDelete",
            "Claim",
            "Close",
            "Delete",
            "ReOpen",
            "ReClose"
        ]; // 8 TYPES
    };

    getType() { 
        if(this.TicketType.includes(this.type.toString())) {
            return this.type;
        } else {
            return null;
        };
    };

    getAvatarURL(id, avatar) {
        let endpoint = ".png";

        if(avatar === null) { return "https://cdn.discordapp.com/embed/avatars/0.png"; };

        if(avatar.startsWith("a_")) { endpoint = ".gif"; };

        return "https://cdn.discordapp.com/avatars/" + id + "/" + avatar + endpoint;
    };

    getAvatarByType() {
        switch(this.getType()) {
            case "Create":
                return "https://i.imgur.com/M38ZmjM.png";
            case "MemberAdd":
                return "https://i.imgur.com/G6QPFBV.png";
            case "MemberDelete":
                return "https://i.imgur.com/eFJ8xxC.png";
            case "Claim":
                return "https://i.imgur.com/qqEaUyR.png";
            case "Close":
                return "https://i.imgur.com/5ShDA4g.png";
            case "Delete":
                return "https://i.imgur.com/obTW2BS.png";
            case "ReOpen":
                return "https://i.imgur.com/fyogljB.png";
            case "ReClose":
                return "https://i.imgur.com/LAiKBSA.png";
            default:
                return null;
        };
    };

    getUsernameByType() {
        switch(this.getType()) {
            case "Create":
                return "Ticket created";
            case "MemberAdd":
                return "Member added";
            case "MemberDelete":
                return "Member removed";
            case "Claim":
                return "Ticket claimed by a staff";
            case "Close":
                return "Ticket closed";
            case "Delete":
                return "Ticket deleted";
            case "ReOpen":
                return "Ticket re-opened"
            case "ReClose":
                return "Ticket re-closed"
            default:
                return null;
        };
    };

    getTicketType(ticketType) {
        ticketType = ticketType.toString();

        switch(ticketType) {
            case "1":
                return "Requests and problems";
            case "2":
                return "Store, Billing and Payement";
            case "3":
                return "Other questions";
            default:
                return null;
        };
    };

    getEmbedByType() {
        switch(this.getType()) {
            case "Create":
                var CreateEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setAuthor(
                        {
                            name: this.author.username,
                            iconURL: this.getAvatarURL(this.author.id, this.author.avatar)
                        }
                    )
                    .setDescription(`${this.author.username} (<@${this.author.id}>) has created a ticket \`Number #${this.ticket.number}\` (<#${this.ticket.channel_id}>) of type \`${this.getTicketType(this.ticket.type)}\`.`)
                    .setFooter({
                        text: "Created the"
                    })
                    .setTimestamp(new Date(this.ticket.timestamp));

                return CreateEmbed;
            case "MemberAdd":
                var MemberAddEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setAuthor(
                        {
                            name: this.author.username,
                            iconURL: this.getAvatarURL(this.author.id, this.author.avatar)
                        }
                    )
                    .setDescription(`${this.author.username} (<@${this.author.id}>) has added ${this.ticket.addedMember_tag} (<@${this.ticket.addedMember_id}>) in the ticket \`Number #${this.ticket.number}\` (<#${this.ticket.channel_id}>).`)
                    .setFooter({
                        text: 'Added the'
                    })
                    .setTimestamp(new Date(this.ticket.timestamp));

                return MemberAddEmbed;
            case "MemberDelete":
                var MemberDeleteEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setAuthor(
                        {
                            name: this.author.username,
                            iconURL: this.getAvatarURL(this.author.id, this.author.avatar)
                        }
                    )
                    .setDescription(`${this.author.username} (<@${this.author.id}>) has removed ${this.ticket.removedMember_tag} (<@${this.ticket.removedMember_id}>) in the ticket \`Number #${this.ticket.number}\` (<#${this.ticket.channel_id}>).`)
                    .setFooter({
                        text: 'Removed the'
                    })
                    .setTimestamp(new Date(this.ticket.timestamp));

                return MemberDeleteEmbed;
            case "Claim":
                var ClaimEmbed = new EmbedBuilder()
                    .setColor('Orange')
                    .setAuthor(
                        {
                            name: this.author.username,
                            iconURL: this.getAvatarURL(this.author.id, this.author.avatar)
                        }
                    )
                    .setDescription(`${this.author.username} (<@${this.author.id}>) has claimed the ticket \`Number #${this.ticket.number}\` (<#${this.ticket.channel_id}>).`)
                    .setFooter({
                        text: "Claimed the"
                    })
                    .setTimestamp(new Date(this.ticket.timestamp));

                return ClaimEmbed;
            case "Close":
                var CloseEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setAuthor(
                        {
                            name: this.author.username,
                            iconURL: this.getAvatarURL(this.author.id, this.author.avatar)
                        }
                    )
                    .setDescription(`${this.author.username} (<@${this.author.id}>) has closed the ticket \`Number #${this.ticket.number}\` (<#${this.ticket.channel_id}>) with reason: \`${this.ticket.reason}\``)
                    .setFooter({
                        text: "Closed the"
                    })
                    .setTimestamp(new Date(this.ticket.timestamp));

                return CloseEmbed;
            case "Delete":
                var DeleteEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setAuthor(
                        {
                            name: this.author.username,
                            iconURL: this.getAvatarURL(this.author.id, this.author.avatar)
                        }
                    )
                    .setDescription(`${this.author.username} (<@${this.author.id}>) has deleted the ticket \`Number #${this.ticket.number}\` (<#${this.ticket.channel_id}>).`)
                    .setFooter({
                        text: "Deleted the"
                    })
                    .setTimestamp(new Date(this.ticket.timestamp));

                return DeleteEmbed;
            case "ReOpen":
                var ReOpenEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setAuthor(
                        {
                            name: this.author.username,
                            iconURL: this.getAvatarURL(this.author.id, this.author.avatar)
                        }
                    )
                    .setDescription(`${this.author.username} (<@${this.author.id}>) has re-opened the ticket \`Number #${this.ticket.number}\` (<#${this.ticket.channel_id}>).`)
                    .setFooter({
                        text: "Re-opened the"
                    })
                    .setTimestamp(new Date(this.ticket.timestamp));
                
                return ReOpenEmbed;
            case "ReClose":
                var ReCloseEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setAuthor(
                        {
                            name: this.author.username,
                            iconURL: this.getAvatarURL(this.author.id, this.author.avatar)
                        }
                    )
                    .setDescription(`${this.author.username} (<@${this.author.id}>) has closed the ticket \`Number #${this.ticket.number}\` (<#${this.ticket.channel_id}>).`)
                    .setFooter({
                        text: "Re-closed the"
                    })
                    .setTimestamp(new Date(this.ticket.timestamp));

                return ReCloseEmbed;
            default:
                return null;
        }
    };

    SendLogs() {
        let _WebhookClient = new WebhookClient({
            id: config['WebhookID'],
            token: config['WebhookToken']
        });

        _WebhookClient.send({
            username: this.getUsernameByType(),
            avatarURL: this.getAvatarByType(),
            embeds: [this.getEmbedByType()]
        }).catch((err) => {
            console.log(err);
        });
    };
};

module.exports = LogsManager;