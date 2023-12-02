const {
    Events,
} = require('discord.js');

module.exports = {
    EventName: Events.ClientReady,
    async startAsync(client) {
        client.application.commands.create({
            name: 'suggest',
            description: 'Manage suggestions',
            dm_permission: false,
            options: [
                {
                    name: 'accept',
                    description: 'Accept a suggestion.',
                    type: 1,
                    options: [
                        {
                            name: 'message_id',
                            description: 'MessageID',
                            type: 3,
                            required: true
                        }
                    ]
                },
                {
                    name: 'refuse',
                    description: 'Decline a suggestion.',
                    type: 1,
                    options: [
                        {
                            name: 'message_id',
                            description: 'MessageID',
                            type: 3,
                            required: true
                        }
                    ]
                }
            ]
        });
    }
};