const { Events, ActivityType } = require('discord.js');

module.exports = {
    EventName: Events.ClientReady,
    async startAsync(client) {
        updateStatus(client);
        setInterval(() => {
            updateStatus(client);
        }, 600000);
    },
};

function updateStatus(client) {
    const statusMessages = [
        '🌐 Future best WW hosting !',
        '🚪 Opening next year! (fun joke)',
        '🎅 All i want for christmas is you :3',
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