const fs = require('fs')
const YAML = require("yawn-yaml/cjs")
let config = new YAML(fs.readFileSync("./config.yaml").toString()).json
module.exports = message => {
    let client = message.client;
    if (message.author.bot) return;
    if (message.channel.type == "dm") return;
    console.log(config.bot.prefix);
    if (message.content.indexOf(config.bot.prefix) !== 0) return;

    const args = message.content.split(/ +/g)
    const command = args.shift().slice(config.bot.prefix.length).toLowerCase();


    let perms = client.elevation(message);
    let cmd;
    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
        message.flags = [];
        while (args[0] && args[0][0] === "-") {
            message.flags.push(args.shift().slice(1));
        }
        if (perms < cmd.conf.permLevel) return;
        cmd.run(client, message, args);
    }

};