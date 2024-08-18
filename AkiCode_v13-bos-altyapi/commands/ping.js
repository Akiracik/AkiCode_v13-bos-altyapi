const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Botun ping durumunu gösterir ve destek sunucusu linkini verir.'),
    async execute(interaction) {
        const ping = interaction.client.ws.ping;

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('🏓 Pong!')
            .setDescription(`Botun pingi: ${ping}ms`)
            .setTimestamp();

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Destek için tıkla')
                    .setStyle('LINK')
                    .setURL('https://discord.com/invite/6SbCcgBRh8')
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};