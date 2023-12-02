const {
    Events,
} = require('discord.js');

module.exports = {
    EventName: Events.ClientReady,
    async startAsync(client) {
        client.application.commands.create({
            name: 'ticket',
            description: 'Manage tickets',
            dm_permission: false,
            options: [
                {
                    name: 'add',
                    description: 'Add a member in the current ticket',
                    type: 1,
                    options: [
                        {
                            name: 'user',
                            description: 'Member',
                            type: 6,
                            required: true
                        }
                    ]
                },
                {
                    name: 'remove',
                    description: 'Remove a member from the current ticket',
                    type: 1,
                    options: [
                        {
                            name: 'user',
                            description: 'Member',
                            type: 6,
                            required: true
                        }
                    ]
                }
            ]
        });
    }
};


