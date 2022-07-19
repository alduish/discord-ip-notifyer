const { EmbedBuilder } = require('discord.js');

module.exports = function (ip, icon, name, color) {
	const Embed = new EmbedBuilder()
	.setColor(color)
	.setTitle('Server Starting ...')
	.setAuthor({ name: name })
	.setThumbnail(icon)
	.addFields([
		{ name: 'IP :', value: ip },
	])
	.setTimestamp()

	return Embed;
};