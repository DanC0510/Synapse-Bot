const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('show-queue')
    .setDescription('Show the entire queue'),
    async execute(interaction, client) {
      try {
            const player = await client.manager.players.get(interaction.guild.id);
            
            if(!player) return await interaction.reply("Failed to find player!");

            const { channel } = interaction.member.voice;
            if(!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return await interaction.reply("I'm not in the same voice channel as you!");

            let queue_names = `1. [${await player.queue.current.title}](${await player.queue.current.uri})\n`;
            let i = 2; //starts at 2 because the first in the list is above
            for(let track of await player.queue){
                queue_names += `${i}. [${track.title}](${track.uri})\n`;
                i++;
            }

            const embed = new EmbedBuilder()
                .setColor('#1654f0')
                .setTitle('Showing Queue!')
                .setDescription(`**${queue_names}** \n\n**Queue length:** ${player.queue.totalSize}`)
                .setFooter({ text: 'Enjoy the songs!'})

            return await interaction.reply({content: '', embeds: [embed]});
      } 
      catch (error) {
            console.error(error);
            return await interaction.reply(`**An error occurred while trying to show the queue.**`);
      } 
    },
};