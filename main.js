// Totika Tarafından Geliştirilmiştir.
const { Client , Collection, VoiceChannel } = require('discord.js')
const totika = new Client()
const Discord = require("discord.js")
const ytdl = require('ytdl-core')
const settings = './config.yaml'
const fs = require('fs')
const YAML = require("yawn-yaml/cjs")
const { load } = require("js-yaml")
const db = require('megadb')
const voiceState = new db.crearDB('VoiceState');
let config = new YAML(fs.readFileSync("./config.yaml").toString()).json

console.log(config.server)

totika.login(config.bot.token).then(() => console.log(`[${totika.user.tag}] Başarıyla Giriş yaptım!`)).catch(() => console.error(`Yanlış Bir Token Girdiniz.`))

totika.on("ready", () => {
      totika.user.setPresence({ activity: { name: `Ses Botu Yaptırmak İçin: Totika.#0023` , type: "PLAYING"}, status: 'dnd' })
    let vc = totika.channels.cache.get(config.server.voiceChannel)
    if (!vc) throw console.error("Config.yaml da voiceChannel için bir ses kanal idi girmelisiniz.")
    if (!vc instanceof VoiceChannel) throw new TypeError("Belirttiğiniz kanal bir ses kanalı değil")
          vc.join().then(() => console.log(`Ses kanalına başarıyla bağlandım`)).catch(() => console.error(`Ses kanalına bağlanırken bir sorun oluştu!`))
})


totika.on("voiceStateUpdate", async(oldState, newState) => {
    if (!oldState.channelID && newState.channelID && newState.member.id != bot.user.id) {
        let staffs = newState.guild.members.cache.filter(x => x.roles.cache.has(config.server.register) && x.hasPermission("ADMINISTRATOR")).map(x => x.id) // YETKİLİ ROL
        if (newState.channelID === config.server.voiceChannel) {
            let vc = await newState.channel.join()

            if (!newState.channel.members.filter(x => x.id != bot.user.id).some(r => (staffs.includes(r.id) || r.hasPermission("ADMINISTRATOR")))) { //Yetkili yok hoşgeldin oynatma

                vc.play(".mp4")

                const play = () => {
                    const dispatcher = vc.play(p4").on('finish', play)
                }

                play()

                console.log(staffs, "çalıyor")
            } else {
                await vc.play(".mp4")
                console.log(`Yetkili girdi`)
            }
        }
    }
})

// Totika Tarafından Geliştirilmiştir.
// Totika Tarafından Geliştirilmiştir.

