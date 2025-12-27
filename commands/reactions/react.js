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
		const channel = interaction.channel;
		const raw_emoji = interaction.options.getString('emoji');
		const emoji = parse_emoji(raw_emoji);

		try {
				const message = await channel.messages.fetch(interaction.options.getString('message_id'));
				await message.react(emoji.reaction);
			}
		catch (err) {
				console.error(`Failed to react with ${emoji.reaction}:`, err);
			}
	},
};

function parse_emoji(input) 
	{
  		// Custom emoji: <:name:id> or <a:name:id>
  		const custom = input.match(/^<a?:([\w-]+):(\d+)>$/);

  		if (custom) {
    		return {
      			type: 'custom',
      			animated: input.startsWith('<a:'),
      			name: custom[1],
      			id: custom[2],
      			reaction: `${custom[1]}:${custom[2]}`,
	    	};
	  	}

  		// Unicode emoji
  		return {
	    	type: 'unicode',
	    	emoji: input,
		    reaction: input,
  		};
	}