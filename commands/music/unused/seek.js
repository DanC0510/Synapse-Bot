const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('Seeks to position in seconds')
    .addIntegerOption(option => 
      option
      .setName('seek-position')
      .setDescription('Enter the position to go to in the song in seconds')
      .setRequired(true)
    ),
    async execute(interaction, client) {
      try {
            const player = await client.manager.players.get(interaction.guild.id);
            
            if(!player) return await interaction.reply("Failed to find player!");

            const { channel } = interaction.member.voice;
            if(!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return await interaction.reply("I'm not in the same voice channel as you!");

            const seekPosition = interaction.options.getInteger('seek-position');
            if(seekPosition === null || seekPosition === NaN || seekPosition === 0) return await interaction.reply({content: 'Please enter a time to seek to!', empheral: true});
            await player.seek(seekPosition);

            const embed = new EmbedBuilder()
                .setColor('#27b7f5')
                .setTitle(`Seeking to ${seekPosition} seconds in`)
                .setDescription(`**[${player.queue.current.title}](${player.queue.current.uri})** \n\n **Moved to ${seekPosition} seconds into the song!**\n\n**Tracks Queued:** ${player.queue.totalSize}`)
                .setFooter({ text: 'Enjoy the songs!'})

            return await interaction.reply({content: '', embeds: [embed]});
      } 
      catch (error) {
            console.error(error);
            return await interaction.reply(`**An error occurred while trying to seek through the song.**`);
      } 
    },
};