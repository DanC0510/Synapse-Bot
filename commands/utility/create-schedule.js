const { SlashCommandBuilder, time, TimestampStyles, roleMention } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-schedule')
		.setDescription('Creates a schedule for the user.')
		.addStringOption(o => o.setName('date').setRequired(true).setDescription('YYYY-MM-DD'))
		.addStringOption(o => o.setName('time').setRequired(true).setDescription('HH:MM:SS'))
		.addRoleOption(o => o.setName('role').setRequired(true).setDescription('Role to mention in the schedule'))
		.addStringOption(o => o.setName('watching-next').setRequired(true).setDescription('The movie or TV show you are watching next'))
		.addStringOption(o => o.setName('movie1').setRequired(true).setDescription('First movie option'))
		.addStringOption(o => o.setName('movie2').setDescription('Second movie option'))
		.addStringOption(o => o.setName('movie3').setDescription('Third movie option'))
		.addStringOption(o => o.setName('movie4').setDescription('Fourth movie option')),

	async execute(interaction) {
		const date = new Date(`${interaction.options.getString('date')}T${interaction.options.getString('time')}`);
		const timeString = time(date, TimestampStyles.LongDateTime);

		const watchingNext = interaction.options.getString('watching-next');
		const movies = [
			interaction.options.getString('movie1'),
			interaction.options.getString('movie2'),
			interaction.options.getString('movie3'),
			interaction.options.getString('movie4'),
		].filter(Boolean);

		const role = interaction.options.getRole('role');

		// Build movie lines dynamically
		const movieLines = movies.map((m, i) => `${i + 1}\u20E3  **${m}**`).join('\n');

		const messageContent = `# Schedule
**${timeString} - ${watchingNext}**
# Following Movies & TV
Please react below with the corresponding emoji for what film to watch next
${movieLines}
Please create a thread to leave suggestions for the next film/TV show to watch
${roleMention(role.id)}`;

		const message = await interaction.reply({
			content: messageContent,
			allowedMentions: { roles: [role.id] },
			fetchReply: true,
		});

		// Add reactions dynamically
		const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
		for (let i = 0; i < movies.length; i++) {
			await message.react(numberEmojis[i]);
		}
	},
};
