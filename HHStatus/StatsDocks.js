const { Events } = require('discord.js');

module.exports = {
    EventName: Events.ClientReady,
    async startAsync(client) {
        setInterval (() => {
            const guild = client.guilds.cache.get(process.env.GUILDID)
            const membres = guild.memberCount;
            const offline = guild.members.cache.filter(member => member.presence?.status === "offline");
            const online = guild.members.cache.filter(member => member.presence?.status === "online");
            const dnd = guild.members.cache.filter(member => member.presence?.status === 'dnd');
            const idle = guild.members.cache.filter(member => member.presence?.status === 'idle');

            if(guild) {
                guild.channels.cache.get('1180604259465699348').edit({name: `👥 Members: ${membres}`})
                guild.channels.cache.get('1180608797820071946').edit({name: `🟢 ${online.size} ⛔ ${dnd.size} 🌙 ${idle.size + offline.size}`})
                guild.channels.cache.get('1180603973640659027').edit({name: `🔮 Boosts: ${guild.premiumSubscriptionCount}`})
            }
        }, 300000); 
    },
};
