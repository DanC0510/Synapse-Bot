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
            
            await interaction.reply({ content: 'Searching...'});

            const player = await client.manager.createPlayer({
                guildId: interaction.guild.id,
                textId: interaction.channel.id,
                voiceId: channel.id,
                volume: 100,
                deaf: true
            });

            const res = await player.search(search, { requester: interaction.user });

            if(!res.tracks.length){
                return interaction.editReply("No results found!");
            }

            if(res.type === "PLAYLIST") {
                for (let track of res.track){
                    player.queue.add(track);
                }
                if(!player.playing && !player.paused){
                    player.play();
                }
            
                const embed = new EmbedBuilder()
                    .setColor("#1DB954")
                    .setTitle("Playlist Added To Queue")
                    .setDescription(`**[${res.playlistName}](${search})** \n\n**Tracks Queued:** \`${res.tracks.length}`)
                    .setFooter({ text: "Enjoy the songs!"})

                    return interaction.editReply({content: '', embeds: [embed]});
            } else {
                player.queue.add(res.tracks[0]);
                if(!player.playing && !player.paused){
                    player.play();
                }

                const embed = new EmbedBuilder()
                    .setColour("#1DB954")
                    .setTitle("Song Added To Queue")
                    .setDescription(`[${res.tracks[0].title}](${res.track[0].uri})`)
                    .setFooter({text: "Playing now!"})
                    .setTimestamp()

                    return interaction.editReply({content: '', embeds: [embed]});
            }
      } 
      catch (error) {
            console.error(error);
            return interaction.reply(`**An error occurred while trying to play the song.**`);
      } 
    },
};