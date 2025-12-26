const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Loops the currently playing song or queue')
    .addStringOption(option => 
      option
      .setName('loop-type')
      .setDescription('Enter the type of loop to use')
      .setRequired(true)
      .setChoices(
      {
        name: 'Track',
        value: 'track'
      },
      {
        name: 'Queue',
        value: 'queue'
      },
      {
        name: 'No Loop',
        value: 'none'
      })
    ),
    async execute(interaction, client) {
      try {
            const player = await client.manager.players.get(interaction.guild.id);
            
            if(!player) return await interaction.reply("Failed to find player!");

            const { channel } = interaction.member.voice;
            if(!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return await interaction.reply("I'm not in the same voice channel as you!");

            const loopType = interaction.options.getString('loop-type');
            console.log(loopType);
            await player.setLoop(loopType);

            const embed = new EmbedBuilder()
                .setColor('#cf27f5')
                .setTitle(loopType === 'none' ? 'Ending Loop!' : loopType === 'track' ? 'Looping Current Track!' : 'Looping Queue!')
                .setDescription(`**[${player.queue.current.title}](${player.queue.current.uri})** \n\n**Tracks Queued:** ${player.queue.totalSize}`)
                .setFooter({ text: 'Enjoy the songs!'})

            return await interaction.reply({content: '', embeds: [embed]});
      } 
      catch (error) {
            console.error(error);
            return await interaction.reply(`**An error occurred while trying to loop the song.**`);
      } 
    },
};