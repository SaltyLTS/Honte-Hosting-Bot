const { Events, ActivityType } = require('discord.js');

module.exports = {
    EventName: Events.ClientReady,
    async startAsync(client) {
                client.user.setPresence({
                    activities: [
                        {
                            name: `Future best WW hosting !`,
                            type: ActivityType.Custom
                        }
                    ],
                    status: 'Online'
        });
    },
};