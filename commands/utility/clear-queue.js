const { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles, } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear-queue')
    .setDescription('Clears the entire queue'),
    async execute(interaction, client) {
      try {
            const player = await client.manager.players.get(interaction.guild.id);
            
            if(!player) return await interaction.reply("Failed to find player!");

            const { channel } = interaction.member.voice;
            if(!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return await interaction.reply("I'm not in the same voice channel as you!");

            await player.queue.clear();

            const embed = new EmbedBuilder()
                .setColor('#f01616')
                .setTitle('Clearing Queue!')
                .setDescription(`Queue is now Empty!`)
                .setFooter({ text: 'Enjoy your Day!'})

            return await interaction.reply({content: '', embeds: [embed]});
      } 
      catch (error) {
            console.error(error);
            return await interaction.reply(`**An error occurred while trying to clear the queue.**`);
      } 
    },
};