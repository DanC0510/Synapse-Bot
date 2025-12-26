const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Youtube')
    .addStringOption(option =>
        option.setName('search')
        .setDescription('The song to play')
        .setRequired(true)
    ),
    async execute(client, interaction) {
      try {
            const search = interaction.option.getString('search');
            const { channel } = interaction.member.voice;

            if(!channel){
                await interaction.reply({
                    content: 'You must be in a voice channel to play a song',
                    ephemeral: true
                });
            }

            if(!channel.permissionFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)){
                return interaction.reply({
                    content: "**I don't have permission to join this voice channel! Please speak to Server Owner or Moderator to fix!**",
                    ephemeral: true
                });
            }            
      } 
      catch (error) {

      } 
    },
};