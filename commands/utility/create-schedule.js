const { SlashCommandBuilder, time, TimestampStyles, roleMention } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-schedule')
		.setDescription('Creates a schedule for the user.')
		.addStringOption(o => o.setName('date').setRequired(true).setDescription('YYYY-MM-DD'))
		.addStringOption(o => o.setName('time').setRequired(true).setDescription('HH:MM:SS'))
		.addRoleOption(o => o.setName('role').setRequired(true).setDescription('Role to mention in the schedule'))
		.addStringOption(o => o.setName('watching-next').setRequired(true).setDescription('The movie or TV show you are watching next')),

	async execute(interaction) {
		try {
			await interaction.deferReply();
			const date = new Date(`${interaction.options.getString('date')}T${interaction.options.getString('time')}`);
			const timeString = time(date, TimestampStyles.LongDateTime);
			const watchingNext = interaction.options.getString('watching-next');
			const channel = interaction.channel;

			const open_threads = await channel.threads.fetchActive();
			const threads = Array.from(open_threads.threads.values());
			threads.sort((a, b) => b.messageCount - a.messageCount);

			const movies = [];
			for (const thread of threads) {
				if (movies.length == 9) break;
				movies.push(thread.name);

				try {
					await thread.setArchived(true, 'Suggestion is in schedule');
				}
				catch (error) {
					console.error(`Failed to archive thread ${thread.name}:`, error);
				}
			}

			const role = interaction.options.getRole('role');

			const movieLines = movies.map((m, i) => `${i + 1}\u20E3  **${m}**`).join('\n');

			const messageContent = `# Schedule
**${timeString} - ${watchingNext}**
# Following Movies & TV
Please react below with the corresponding emoji for what film to watch next
${movieLines}
Please create a thread to leave suggestions for the next film/TV show to watch
${roleMention(role.id)}`;

			const message = await interaction.editReply({
				content: messageContent,
				allowedMentions: { roles: [role.id] },
				fetchReply: true,
			});

			// Add reactions for voting
			const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
			for (let i = 0; i < movies.length; i++) {
				try {
					await message.react(numberEmojis[i]);
				}
				catch (err) {
					console.error(`Failed to react with ${numberEmojis[i]}:`, err);
				}
			}
		}
		catch (error) {
			console.error('Error executing create-schedule command:', error);

			if (interaction.deferred || interaction.replied) {
				await interaction.editReply('There was an error while executing this command.');
			}
			else {
				await interaction.reply('There was an error while executing this command.');
			}
		}
	},
};
