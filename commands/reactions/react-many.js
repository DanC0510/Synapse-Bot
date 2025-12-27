const { SlashCommandBuilder } = require('discord.js');
const emojiRegex = require('emoji-regex');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('react-many')
		.setDescription('Reacts to the message supplied with multiple emojis (Max 20).')
		.addStringOption(o => 
			o.setName('message_id')
			.setRequired(true)
			.setDescription('Message to react to'))
		.addStringOption(o => 
			o.setName('emojis')
			.setRequired(true)
			.setDescription('Emojis to react with (Max 20).')),
	async execute(interaction) {
		const channel = interaction.channel;
		const raw_emojis = extractAllEmojis(interaction.options.getString('emojis'));
		console.log(interaction.options.getString('emojis') + ' ' + raw_emojis);
		const message = await channel.messages.fetch(interaction.options.getString('message_id'));
		for(let raw_emoji of raw_emojis){
			const emoji = parse_emoji(raw_emoji);
			try {
					await message.react(emoji.reaction);
				}
			catch (err) {
					console.error(`Failed to react with ${emoji.reaction}:`, err);
				}
		}
		await interaction.reply({
			content: `Reacted with emojis`,
			ephemeral: true
		});

		await interaction.deleteReply();
	},
};
function parse_emoji(input) {
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

function extractAllEmojis(str) {
    const customRegex = /<a?:\w+:\d+>/g;
    const matches = [];

    // Match custom emojis
    let match;
    while ((match = customRegex.exec(str)) !== null) {
        matches.push({ emoji: match[0], index: match.index });
    }

    // Match Unicode emojis using emoji-regex
    const unicodeRegex = emojiRegex();
    while ((match = unicodeRegex.exec(str)) !== null) {
        // Skip if overlapping with a custom emoji
        if (!matches.some(c => match.index >= c.index && match.index < c.index + c.emoji.length)) {
            matches.push({ emoji: match[0], index: match.index });
        }
    }

    // Sort by position to preserve order
    matches.sort((a, b) => a.index - b.index);

    return matches.map(m => m.emoji);
}
