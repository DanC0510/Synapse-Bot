const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('play').setDescription('Plays Music'),
    async execute(client, interaction) {
        
    },
};