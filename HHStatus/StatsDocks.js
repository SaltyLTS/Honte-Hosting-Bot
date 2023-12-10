const { Events } = require('discord.js');

module.exports = {
    EventName: Events.ClientReady,
    async startAsync(client) {
        setInterval (() => {
            const guild = client.guilds.cache.get(process.env.GUILDID)
            const membres = guild.memberCount;
            const online = guild.members.cache.filter(member => ['online'].includes(member.presence?.status)).size;
            const dnd = guild.members.cache.filter(member => ['dnd'].includes(member.presence?.status)).size;
            const idle = guild.members.cache.filter(member => ['idle'].includes(member.presence?.status)).size;
            const offline = guild.members.cache.filter(member => !['online', 'dnd', 'idle'].includes(member.presence?.status)).size;
            const idleOff = (idle + offline);

            if(guild) {
                guild.channels.cache.get('1180604259465699348').edit({name: `👥 Members: ${membres}`})
                guild.channels.cache.get('1180608797820071946').edit({name: `🟢 ${online} ⛔ ${dnd} 🌙 ${idleOff}`})
                guild.channels.cache.get('1180603973640659027').edit({name: `🔮 Boosts: ${guild.premiumSubscriptionCount}`})
            }
        }, 5000); 
    },
};
