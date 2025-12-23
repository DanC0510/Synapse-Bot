const { SlashCommandBuilder, time, TimestampStyles } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-schedule')
		.setDescription('Creates a schedule for the user.')
		.addStringOption(option => option.setName('date').setRequired(true).setDescription('The date of the schedule in YYYY-MM-DD format'))
		.addStringOption(option => option.setName('time').setRequired(true).setDescription('The time of the schedule in HH:MM:SS format'))
		.addStringOption(option => option.setName('watching-next').setRequired(true).setDescription('The movie or TV show you are watching next'))
		.addStringOption(option => option.setName('movie1').setRequired(true).setDescription('The first movie option'))
		.addStringOption(option => option.setName('movie2').setRequired(true).setDescription('The second movie option'))
		.addStringOption(option => option.setName('movie3').setRequired(true).setDescription('The third movie option'))
		.addStringOption(option => option.setName('movie4').setRequired(true).setDescription('The fourth movie option'))
		.addRoleOption(option => option.setName('role').setRequired(true).setDescription('The role to mention')),
	async execute(interaction) {
		const date = new Date(interaction.options.getString('date') + 'T' + interaction.options.getString('time'));
		const timeString = time(date, TimestampStyles.LongDateTime);

		const response = await interaction.reply({
			content: `# Schedule
**${timeString} - ${interaction.options.getString('watching-next')}**
# Following Movies & TV
Please react below with the corresponding emoji for what film to watch next
:one:  **${interaction.options.getString('movie1')}**
:two:  **${interaction.options.getString('movie2')}**
:three:  **${interaction.options.getString('movie3')}**
:four:  **${interaction.options.getString('movie4')}**
Please create a thread to leave suggestions for the next film/TV show to watch
${interaction.options.getRole('role')}`, withResponse: true,
		});

		const { message } = response.resource;
		message.react('1️⃣');
		message.react('2️⃣');
		message.react('3️⃣');
		message.react('4️⃣');
	},
};