const { HHDatabase } = require('../index.js');
const Sequelize          = require('sequelize');

const HHTickets = HHDatabase.define('HHTickets', {
    channel_id: {
        type: Sequelize.STRING,
        unique: true
    },
    message_id: {
        type: Sequelize.STRING,
        unique: true
    },
    ticketControls_id: {
        type: Sequelize.STRING,
        defaultValue: null,
        unique: true
    },
    author_id: {
        type: Sequelize.STRING
    },
    claimer_id: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    closer_id: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    reOpener_id: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    invited_id: {
        type: Sequelize.STRING,
        defaultValue: "[]"
    },
    createdAt: {
        type: Sequelize.BIGINT
    },
    claimedAt: {
        type: Sequelize.BIGINT,
        defaultValue: null
    },
    closedAt: {
        type: Sequelize.BIGINT,
        defaultValue: null
    },
    reOpenedAt: {
        type: Sequelize.BIGINT,
        defaultValue: null
    },
    closeReason: {
        type: Sequelize.STRING,
        defaultValue: null
    }
});

module.exports.HHTickets = HHTickets;