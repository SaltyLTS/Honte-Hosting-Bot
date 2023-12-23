const { Events, ActivityType } = require('discord.js');

module.exports = {
    EventName: Events.ClientReady,
    async startAsync(client) {
        updateStatus(client);
        setInterval(() => {
            updateStatus(client);
        }, 180000);
    },
};

function updateStatus(client) {
    const statusMessages = [
        'Future best WW hosting !',
        'Opening soon !',
        'I love you guys :3',
    ];

    const randomStatus = statusMessages[Math.floor(Math.random() * statusMessages.length)];

    client.user.setPresence({
        activities: [
            {
                name: randomStatus,
                type: ActivityType.Custom
            }
        ],
        status: 'online'
    });
}