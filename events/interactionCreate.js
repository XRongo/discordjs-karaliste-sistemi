const Discord = require("discord.js")
const FS = require("fs")
const xrongodb = require("croxydb")

module.exports = {
    name: "interactionCreate",
    once: false, 

    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {
        if (!interaction.guild || interaction.user.bot) return;
        if (interaction.type !== Discord.InteractionType.ApplicationCommand) return;

		const dbCheck = xrongodb.fetch(`karaliste.${interaction.user.id}`)

		const embed = new Discord.EmbedBuilder()
        .setColor("Red")
		.setDescription(`**${dbCheck}** sebebiyle kara listemde olduğun için komutlarımı kullanamazsın!`)

		if (dbCheck) return interaction.reply({embeds: [embed], ephemeral: true})

        FS.readdirSync("./commands")
		.filter((file) => file.endsWith(".js"))
		.forEach((file) => {
			const cmd = require(`../commands/${file}`)
			if (cmd.name === interaction.commandName) {
				cmd.execute(client, interaction)
			}
		})
    }
}