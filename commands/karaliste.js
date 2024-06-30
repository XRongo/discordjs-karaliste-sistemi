const Discord = require("discord.js")
const ayarlar = require("../ayarlar")
const xrongodb = require("croxydb")

module.exports = {
    name: "karaliste",
    description: "?",
    type: 1,
    options: [
        {
            name: "ekle",
            description: "Kara listeye kişi eklersiniz.",
            type: 1,
            options: [
                {
                    name: "kullanıcı",
                    description: "Kara listeye almak istediğiniz kullanıcı?",
                    type: 6,
                    required: true
                },
                {
                    name: "sebep",
                    description: "Kara listeye alma sebebiniz?",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "çıkar",
            description: "Kara listeden kişi çıkarırsınız.",
            type: 1,
            options: [
                {
                    name: "kullanıcı",
                    description: "Kara listeye almak istediğiniz kullanıcı?",
                    type: 6,
                    required: true
                }
            ]
        },
        {
            name: "sıfırla",
            description: "Kara listeyi sıfırlarsınız.",
            type: 1,
        }
    ],

    async execute(client, interaction) {
        const embed = new Discord.EmbedBuilder()
            .setColor("Red")

        if (!ayarlar.karaliste_sistemi.devIds.includes(interaction.user.id)) {
            embed.setDescription(`Bu komutu sadece sahibim kullanabilir!`)
            return interaction.reply({ embeds: [embed] })
        }

        if (interaction.options.getSubcommand() === "ekle") {
            const user = interaction.options.getUser("kullanıcı")
            const reason = interaction.options.getString("sebep")
            const dbCheck = xrongodb.fetch(`karaliste_${user.id}`)

            if (dbCheck) {
                embed.setDescription(`Bu kullanıcı zaten kara listemde!`)
                return interaction.reply({ embeds: [embed], ephemeral: true })
            }

            if (ayarlar.karaliste_sistemi.devIds.includes(user.id)) {
                embed.setDescription(`Sahiplerimi kara listeme ekleyemem!`)
                return interaction.reply({ embeds: [embed], ephemeral: true })
            }

            xrongodb.set(`karaliste.${user.id}`, reason)

            embed.setDescription(`${user} adlı kullanıcıyı **${reason}** sebebiyle kara listeme ekledim!`)

            interaction.reply({ embeds: [embed] })

            client.channels.cache.get(ayarlar.karaliste_sistemi.logChannel).send(`**${user.tag}** ${interaction.user.tag} tarafından **${reason}** sebebiyle **kara listeme** eklendi!`)
        } else if (interaction.options.getSubcommand() === "çıkar") {
            const user = interaction.options.getUser("kullanıcı")
            const dbCheck = xrongodb.fetch(`karaliste.${user.id}`)

            if (!dbCheck) {
                embed.setDescription(`Bu kullanıcı zaten kara listemde değil!`)
                return interaction.reply({ embeds: [embed], ephemeral: true })
            }

            xrongodb.delete(`karaliste.${user.id}`)

            embed.setDescription(`${user} adlı kullanıcıyı kara listemden çıkardım!`)

            interaction.reply({ embeds: [embed] })

            client.channels.cache.get(ayarlar.karaliste_sistemi.logChannel).send(`**${user.tag}** ${interaction.user.tag} tarafından  **kara listemden** çıkarıldı!`)
        } else if (interaction.options.getSubcommand() === "sıfırla") {
            const dbCheck = xrongodb.fetch(`karaliste`)

            if (!dbCheck) {
                embed.setDescription(`Kara listem zaten boş!`)
                return interaction.reply({ embeds: [embed], ephemeral: true })
            }

            xrongodb.delete(`karaliste`)

            embed.setDescription(`Kara listemi sıfırladım!`)

            interaction.reply({ embeds: [embed] })

            client.channels.cache.get(ayarlar.karaliste_sistemi.logChannel).send(`${interaction.user.tag} tarafından **kara listem** sıfırlandı!`)
        }
    }
}