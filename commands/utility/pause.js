const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause currently playing song'),
    async execute(interaction, client) {
      try {
            const player = await client.manager.players.get(interaction.guild.id);
            
            if(!player) return await interaction.reply("Failed to find player!");

            const { channel } = interaction.member.voice;
            if(!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return await interaction.reply("I'm not in the same voice channel as you!");

            const paused = !player.paused
            await player.pause(paused);

            const embed = new EmbedBuilder()
                .setColor('#F54927')
                .setTitle('Current Song Paused')
                .setDescription(`**[${player.queue.current.title}](${player.queue.current.uri}) Paused** \n\n**Tracks Queued:** ${player.queue.totalSize}`)
                .setFooter({ text: 'Enjoy the songs!'})

            return await interaction.reply({content: '', embeds: [embed]});
      } 
      catch (error) {
            console.error(error);
            return await interaction.reply(`**An error occurred while trying to pause the song.**`);
      } 
    },
};