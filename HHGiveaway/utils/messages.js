const everyoneMention = process.env.everyoneMention;

module.exports = {
    giveaway: (everyoneMention ? "@everyone\n\n" : "")+"🎉🎉 **GIVEAWAY** 🎉🎉",
    giveawayEnded: (everyoneMention ? "@everyone\n\n" : "")+"🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
    title: '{this.prize}',
    inviteToParticipate: 'React with 🎉 to participate!',
    winMessage: 'Congratulations, {winners}! You won **{this.prize}**!',
    drawing: 'Drawing: {timestamp}',
    dropMessage: 'Be the first to react with 🎉 !',
    embedFooter: '{this.winnerCount} winner(s)',
    noWinner: 'Giveaway cancelled, no valid participations.',
    winners: 'Winner(s):',
    endedAt: 'Ended at',
    hostedBy: 'Hosted by: {this.hostedBy}'
};