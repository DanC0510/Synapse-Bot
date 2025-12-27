/* eslint-disable no-inline-comments */
const { SlashCommandBuilder, time, TimestampStyles, roleMention } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-schedule')
		.setDescription('Creates a schedule for the user.')
		.addStringOption(o => o.setName('date').setRequired(true).setDescription('YYYY-MM-DD'))
		.addStringOption(o => o.setName('time').setRequired(true).setDescription('HH:MM:SS'))
		.addRoleOption(o => o.setName('role').setRequired(true).setDescription('Role to mention in the schedule')),

	async execute(interaction) {
		try {
			await interaction.deferReply();
			const date = new Date(`${interaction.options.getString('date')}T${interaction.options.getString('time')}`);
			const timeString = time(date, TimestampStyles.LongDateTime);
			const channel = interaction.channel;

			const messages = await channel.messages.fetch({ limit: 2 });
			const prevSchedule = await messages.last();

			const reactionCounts = [];

			const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
			for (let i = 0; i < numberEmojis.length; i++) {
				const reaction = prevSchedule.reactions.cache.get(numberEmojis[i]);
				if (reaction) {
					reactionCounts.push({ index: i, count: reaction.count - 1 }); // subtract bot's own reaction
				}
				else {
					reactionCounts.push({ index: i, count: 0 });
				}
			}

			const movieRegex = /\d+\u20E3\s+\*\*(.+?)\*\*/g;
			const prevMovies = [];
			let match;
			while ((match = movieRegex.exec(prevSchedule.content)) !== null) {
				prevMovies.push(match[1]); // match[1] is the movie name
			}

			// Find the highest voted index
			const highestVote = reactionCounts.reduce((prev, curr) => curr.count > prev.count ? curr : prev);
			const winningMovie = prevMovies[highestVote.index]; // prevMovies = array of previous thread/movie names
			//  Fetch open threads and sort them by message count
			const open_threads = await channel.threads.fetchActive();
			const threads = Array.from(open_threads.threads.values());
			threads.sort((a, b) => b.messageCount - a.messageCount);
			// Fetch top 9 threads and close them as they are now scheduled
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
**${timeString} - ${winningMovie}**
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
