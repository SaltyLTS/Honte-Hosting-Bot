const { 
    Events,
    PermissionsBitField,
} = require('discord.js');

const { HHTickets } = require('./HHTickets.js');
const LogsManager       = require('./LogsManager.js');
const config            = require('../config.json');

module.exports = {
    EventName: Events.InteractionCreate,
    async startAsync(interaction) {
        if(interaction.isCommand()) {
            if(interaction.commandName.toLowerCase() === 'ticket') {
                switch(interaction.options.getSubcommand()) {
                    case "add":
                        var isTicket = await HHTickets.findOne({ where: { channel_id: interaction.channel.id } });
    
                        if (!isTicket) return interaction.reply({ content: `<@${interaction.member.user.id}> this command have to be executed in a ticket channel.`, ephemeral: true })
    
                        if(interaction.member.user.id === isTicket.author_id || interaction.member.roles.cache.some(role => config['HHTickets']['staffRoles'].includes(role.id))) {
                            try {
                                var newArrInvited        = [];
                                var permissionOverwrites = [{ id: interaction.options.getUser('user').id, allow: [ PermissionsBitField.Flags.ViewChannel ] }, { id: interaction.guild.id, deny: [ PermissionsBitField.Flags.ViewChannel ] }];
                                var alreadyExists        = false;
    
                                for(var i = 0; i < JSON.parse(isTicket.invited_id).length; i++) {
                                    if (JSON.parse(isTicket.invited_id)[i] === interaction.options.getUser('user').id) {
                                        interaction.reply({ content: `<@${interaction.member.user.id}> User <@${interaction.options.getUser('user').id}> has already been added in the ticket.` });
                                        alreadyExists = true;
                                        continue;
                                    };
    
                                    newArrInvited.push(JSON.parse(isTicket.invited_id)[i]);
                                    permissionOverwrites.push({
                                        id: JSON.parse(isTicket.invited_id)[i],
                                        allow: [
                                            PermissionsBitField.Flags.ViewChannel
                                        ]
                                    })
                                };

                                config['HHTickets']['staffRoles'].forEach(element => {
                                    permissionOverwrites.push({
                                        id: element,
                                        allow: [
                                            PermissionsBitField.Flags.ViewChannel
                                        ]
                                    });
                                });
    
                                if(!alreadyExists) {
                                    newArrInvited.push(interaction.options.getUser('user').id);
                                
                                    interaction.guild.channels.cache.get(isTicket.channel_id).permissionOverwrites.set(permissionOverwrites);
                                
                                    isTicket.update({ invited_id: JSON.stringify(newArrInvited) }).then(_TicketDB => {
                                        interaction.reply({ content: `<@${interaction.member.user.id}> added <@${interaction.options.getUser('user').id}> to the ticket.` });
    
                                        new LogsManager('MemberAdd', interaction.member.user, {
                                            channel_id: _TicketDB.channel_id,
                                            number: ("0000" + (_TicketDB.id)).slice(-4),
                                            timestamp: Date.now(),
                                            addedMember_tag: interaction.options.getUser('user').tag,
                                            addedMember_id: interaction.options.getUser('user').id 
                                        }).SendLogs();
                                    });
                                };
                            } catch (err) {
                                console.log(err);
                            }
                        } else {
                            return interaction.reply({ content: `<@${interaction.member.user.id}> You do not have necessery permissions for this action.` });
                        };
    
                        break;
                    case "remove":
                        var isTicket = await HHTickets.findOne({ where: { channel_id: interaction.channel.id } });
    
                        if (!isTicket) return interaction.reply({ content: `<@${interaction.member.user.id}> this command have to be executed in a ticket channel.`, ephemeral: true })
    
                        if(interaction.member.user.id === isTicket.author_id || interaction.member.roles.cache.some(role => config['HHTickets']['staffRoles'].includes(role.id))) {
                            try {
                                var newArrInvited        = [];
                                var permissionOverwrites = [{ id: interaction.options.getUser('user').id, deny: [ PermissionsBitField.Flags.ViewChannel ] }, { id: interaction.guild.id, deny: [ PermissionsBitField.Flags.ViewChannel ] }];
                                var alreadyExists        = false;
                                
                                for(var i = 0; i < JSON.parse(isTicket.invited_id).length; i++) {
                                    if (JSON.parse(isTicket.invited_id)[i] === interaction.options.getUser('user').id) {
                                        interaction.reply({ content: `<@${interaction.member.user.id}> User <@${interaction.options.getUser('user').id}> has been removed from the ticket.` });
                                        alreadyExists = true;
                                        continue;
                                    };

                                    permissionOverwrites.push({
                                        id: JSON.parse(isTicket.invited_id)[i],
                                        allow: [
                                            PermissionsBitField.Flags.ViewChannel
                                        ]
                                    })
                                    newArrInvited.push(JSON.parse(isTicket.invited_id)[i]);
                                };

                                config['HHTickets']['staffRoles'].forEach(element => {
                                    permissionOverwrites.push({
                                        id: element,
                                        allow: [
                                            PermissionsBitField.Flags.ViewChannel
                                        ]
                                    });
                                });
    
                                if(!alreadyExists) return interaction.reply({ content: `<@${interaction.member.user.id}> User <@${interaction.options.getUser('user').id}> is not in the ticket.` });
                                
                                interaction.guild.channels.cache.get(isTicket.channel_id).permissionOverwrites.set(permissionOverwrites);
                                
                                isTicket.update({ invited_id: JSON.stringify(newArrInvited) }).then(_TicketDB => {
                                    new LogsManager('MemberDelete', interaction.member.user, {
                                        channel_id: _TicketDB.channel_id,
                                        number: ("0000" + (_TicketDB.id)).slice(-4),
                                        timestamp: Date.now(),
                                        removedMember_tag: interaction.options.getUser('user').tag,
                                        removedMember_id: interaction.options.getUser('user').id 
                                    }).SendLogs();
                                });
                            } catch (err) {
                                console.log(err);
                            }
                        } else {
                            return interaction.reply({ content: `<@${interaction.member.user.id}> You do not have necessery permissions for this action.` });
                        };
    
                        break;
                };
            };
        };
    }
};