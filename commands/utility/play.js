const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Youtube')
    .addStringOption(option =>
        option.setName('search')
        .setDescription('The song to play')
    ),
    async execute(interaction, client) {
      try {
        if(interaction.options.getString('search')){
            const search = interaction.options.getString('search');
            const { channel } = interaction.member.voice;

            if(!channel){
                await interaction.reply({
                    content: 'You must be in a voice channel to play a song',
                    ephemeral: true
                });
            }

            if(!channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.Connect)){
                return await interaction.reply({
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

            if(!res.tracks.length || !res){
                return interaction.editReply("No results found!");
            }

            if(res.type === "PLAYLIST") {
                for (let track of res.tracks){
                    player.queue.add(track);
                }
                if(!player.playing && !player.paused){
                    player.play();
                }
            
                const embed = new EmbedBuilder()
                    .setColor('#1DB954')
                    .setTitle('Playlist Added To Queue')
                    .setDescription(`**[${res.playlistName}](${search})** \n\n**Tracks Queued:** ${player.queue.totalSize}`)
                    .setFooter({ text: 'Enjoy the songs!'})

                    return await interaction.editReply({content: '', embeds: [embed]});
            } else {
                player.queue.add(res.tracks[0]);
                if(!player.playing && !player.paused){
                    player.play();
                }

                const embed = new EmbedBuilder()
                    .setColor('#1DB954')
                    .setTitle('Song Added To Queue')
                    .setDescription(`**[${res.tracks[0].title}](${res.tracks[0].uri})** \n\n**Tracks Queued:** ${player.queue.totalSize}`)
                    .setFooter({text: 'Playing now!'})
                    .setTimestamp()

                    return await interaction.editReply({content: '', embeds: [embed]});
            }
        }
        else{
            const player = await client.manager.players.get(interaction.guild.id);
            
            if(!player.paused) { return await interaction.reply(`**There is already a song playing!**`) }
            player.play();
            const embed = new EmbedBuilder()
                    .setColor('#1DB954')
                    .setTitle('Resumed Track')
                    .setDescription(`**[${player.queue.current.title}](${player.queue.current.uri})** \n\n**Tracks Queued:** ${player.queue.totalSize}`)
                    .setFooter({text: 'Playing now!'})
                    .setTimestamp()

                    return await interaction.reply({content: '', embeds: [embed]});
        }
      } 
      catch (error) {
            console.error(error);
            return await interaction.reply(`**An error occurred while trying to play the song.**`);
      } 
    },
};