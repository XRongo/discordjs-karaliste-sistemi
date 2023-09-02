const Discord = require("discord.js")

module.exports = {
    name: "ping",
    description: "Botun gecikmesini gösterir.",
    type: 1,
    options: [],

    /**
     * @param {Discord.Client} client
     * @param {Discord.ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        interaction.reply(`Ölçülüyor...`).then(() => {
            setTimeout(() => {
                interaction.editReply(`Ping: ${client.ws.ping}`)
            }, 2000)
        })
    }
}