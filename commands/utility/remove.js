const { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles, } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Removes a selected track from the queue')
    .addIntegerOption(option => 
      option
      .setName('index')
      .setDescription('Index of item you want to remove from queue')
      .setRequired(true)
    ),
    async execute(interaction, client) {
      try {
            if(interaction.options.getInteger('index') === 0) return await interaction.reply(`**You can not remove the song at index 0**`)
            else if(interaction.options.getInteger('index') === 1) return await interaction.reply(`**You can not remove the song you are listening to, please use /skip instead**`);
            const player = await client.manager.players.get(interaction.guild.id);
            
            if(!player) return await interaction.reply("Failed to find player!");

            const { channel } = interaction.member.voice;
            if(!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return await interaction.reply("I'm not in the same voice channel as you!");
            let track;
            for(track of player.queue){
              if(track === player.queue[(interaction.options.getInteger('index') - 2)]) break;
            }

            await player.queue.remove((interaction.options.getInteger('index') - 2)); // -2 to offset the index starting at 2 in show-queue.js

            const embed = new EmbedBuilder()
                .setColor('#f01616')
                .setTitle('Removing from queue!')
                .setDescription(`Removed [${track.title}](${track.uri}) from queue at position ${interaction.options.getInteger('index')}!`)
                .setFooter({ text: 'Enjoy your Day!'})

            return await interaction.reply({content: '', embeds: [embed]});
      } 
      catch (error) {
            console.error(error);
            return await interaction.reply(`**An error occurred while trying to remove a song from the queue.**`);
      } 
    },
};