const { SlashCommandBuilder, ChannelType, Guild } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('react')
		.setDescription('Reacts to the message supplied.')
		.addStringOption(o => 
			o.setName('message_id')
			.setRequired(true)
			.setDescription('Message to react to'))
		.addStringOption(o => 
			o.setName('emoji')
			.setRequired(true)
			.setDescription('Emoji to react with')),
	async execute(interaction) {
		try {
			const channel = interaction.channel;

			try {
					const message = await channel.messages.fetch(interaction.options.getString('message_id'));
					await message.react(interaction.options.getString('emoji'));
				}
			catch (err) {
					console.error(`Failed to react with ${interaction.options.getString('emoji')}:`, err);
				}

			await interaction.reply({
				content: `Reacted with ${interaction.options.getString('emoji')}`,
				ephemeral: true
			});
		}
		catch (error) {
			console.error('Error executing reaction command:', error);

			if (interaction.deferred || interaction.replied) {
				await interaction.editReply('There was an error while executing this command.');
			}
			else {
				await interaction.reply('There was an error while executing this command.');
			}
		}
	},
};
