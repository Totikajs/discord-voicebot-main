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
require('./utils/eventLoader.js')(totika);
// Totika Tarafından Geliştirilmiştir.

totika.commands = new Collection();
totika.aliases = new Collection();
let log = console.log;
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        totika.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            totika.aliases.set(alias, props.help.name);
        });
    });
});

totika.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            totika.commands.delete(command);
            totika.aliases.forEach((cmd, alias) => {
                if (cmd === command) totika.aliases.delete(alias);
            });
            totika.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                totika.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

totika.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            totika.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                totika.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




totika.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            totika.commands.delete(command);
            totika.aliases.forEach((cmd, alias) => {
                if (cmd === command) totika.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

totika.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === settings.sahip) permlvl = 4;
    return permlvl;
};


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
    if (!oldState.channelID && newState.channelID && newState.member.id != totika.user.id) {
        let staffs = newState.guild.members.cache.filter(x => x.roles.cache.has(config.server.register) && x.hasPermission("ADMINISTRATOR")).map(x => x.id) // YETKİLİ ROL
        if (newState.channelID === config.server.voiceChannel) {
            let vc = await newState.channel.join()

            if (!newState.channel.members.filter(x => x.id != totika.user.id).some(r => (staffs.includes(r.id) || r.hasPermission("ADMINISTRATOR")))) { //Yetkili yok hoşgeldin oynatma

                vc.play()

                const play = ("Default_files/dosya.mp3") => {
                    const dispatcher = vc.play("Default_files/dosya.mp3").on('finish', play)
                }

                play()

                console.log(staffs, "çalıyor")
            } else {
                await vc.play("Default_files/dosya.mp3")
                console.log(`Yetkili girdi`)
            }
        }
    }
})



