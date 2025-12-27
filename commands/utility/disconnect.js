const { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles, } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnects the bot from the voice channel'),
    async execute(interaction, client) {
      try {
            const player = await client.manager.players.get(interaction.guild.id);
            
            if(!player) return await interaction.reply("Failed to find player!");

            const { channel } = interaction.member.voice;
            if(!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return await interaction.reply("I'm not in the same voice channel as you!");

            await player.destroy();

            const embed = new EmbedBuilder()
                .setColor('#f01616')
                .setTitle('Disconnecting!')
                .setDescription(`Goodbye, I had fun!\nLet's do it again!`)
                .setFooter({ text: 'I Hope you enjoy your day!'})

            return await interaction.reply({content: '', embeds: [embed]});
      } 
      catch (error) {
            console.error(error);
            return await interaction.reply(`**An error occurred while trying to disconnect.**`);
      } 
    },
};