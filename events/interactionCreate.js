const Discord = require("discord.js")
const xrongodb = require("croxydb")

module.exports = {
    name: "interactionCreate",

    async execute(client, interaction) {
        if (!interaction.guild || interaction.user.bot) return;
        if (interaction.type !== Discord.InteractionType.ApplicationCommand) return;

        const dbCheck = xrongodb.fetch(`karaliste.${interaction.user.id}`)

        const embed = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription(`**${dbCheck}** sebebiyle kara listemde olduğun için komutlarımı kullanamazsın!`)

        if (dbCheck) return interaction.reply({ embeds: [embed], ephemeral: true })

        try {
            const command = client.slashCommands.get(interaction.commandName)
            if (!command) return;


            if (!interaction.member) {
                interaction.member = await interaction.guild.members.fetch(interaction.user.id);
            }

            await command.execute(client, interaction)
        } catch (error) {
            client.error(`[COMMAND] ${interaction.commandName} komutunda bir hata oluştu: ${error}`)
            return interaction.reply({ content: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.", ephemeral: true })
        }
    }
}