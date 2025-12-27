const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('connect')
    .setDescription('Connect to the voice channel you are in'),
    async execute(interaction, client) {
      try {
            const { channel } = interaction.member.voice;

            if(!channel){
                await interaction.reply({
                    content: 'You must be in a voice channel',
                    ephemeral: true
                });
            }

            if(!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)){
                return await interaction.reply({
                    content: "**I don't have permission to join this voice channel! Please speak to Server Owner or Moderator to fix!**",
                    ephemeral: true
                });
            }

            const player = await client.manager.createPlayer({
                guildId: interaction.guild.id,
                textId: interaction.channel.id,
                voiceId: channel.id,
                volume: 100,
                deaf: true
            });

            
            const embed = new EmbedBuilder()
                .setColor('#1DB954')
                .setTitle('Connected to your Voice Channel')
                .setDescription(`Hello! Ready to listen to some Music?`)
                .setFooter({ text: 'Enjoy the songs and have fun!'});

            return await interaction.reply({content: '', embeds: [embed]});
            
      } 
      catch (error) {
            console.error(error);
            return await interaction.reply(`**An error occurred while trying to play the song.**`);
      } 
    },
};