const Discord = require("discord.js");
const fs = require("fs");
const mineflayer = require("mineflayer");
const ms = require("ms");
const chalk = require("chalk");
const client = new Discord.Client();

let config = require("./config.json");
let token = config.token;
let guild = config.guild;
let prefix = config.prefix;
let admin = config.adminRole
let username = config.username;
let password = config.password;
let server = config.server;
let joincommand = config.joincommand;
let chatid = config.chatid;

let timer = new Set();
let timercooldown = 7;

let color = "FF4848";
let white = chalk.hex("#ffffff");
let consolecolor = chalk.hex("#FF4848");

let bot = mineflayer.createBot({
    version: "1.12.2",
    host: server,
    username: username,
    port: 25127

});

client.on("ready", async () => {
    console.log(white("Discord─────────────────────────────────────────────────────"))
    console.log(white("────────────────────────────────────────────────────────────"))
    console.log(`${consolecolor("• Bot User \u00bb")} ${white(`Logged into user`)} ${consolecolor(client.user.tag)}`)
    console.log(white("────────────────────────────────────────────────────────────"))
})

bot.on("login", async () => {
    console.log(white("Minecraft───────────────────────────────────────────────────"))
    console.log(white("────────────────────────────────────────────────────────────"))
    console.log(`${consolecolor("• Bot User \u00bb")} ${white(`Logged into IGN`)} ${consolecolor(bot.username)}`)
    console.log(`${consolecolor("• Server \u00bb")} ${white(`Logged into`)} ${consolecolor(server)}`)
    console.log(white("────────────────────────────────────────────────────────────"))
    bot.chat(joincommand)
})

// Explosion Event (TNT Detector Itself)
bot._client.on('explosion', data => {
    fs.readFile("./settings.json", "utf8", function (err, datam) {
        var setting = JSON.parse(datam);

        if (setting.enabled == true) {
            const embed = new Discord.MessageEmbed()
                .setThumbnail("http://icons.iconarchive.com/icons/chrisl21/minecraft/256/Tnt-icon.png")
                .setColor(color)
                .setTitle("TNT Detected")
                .setDescription(`**Tnt has been detected near this bot**
                
                **Explosion X** - ${(Math.round(data.x * 100) / 100).toFixed(0)}
                **Explosion Y** - ${(Math.round(data.y * 100) / 100).toFixed(0)}
                **Explosion Z** - ${(Math.round(data.z * 100) / 100).toFixed(0)}`)

            if (timer.has(guild)) return

            const channel = client.channels.cache.get(setting.channel)
            if (!channel) return
            const role = `${setting.pingrole}`
            if (!role) { channel.send("@everyone") } else { channel.send(`<@&${role}>`) }
            channel.send(embed)
            timer.add(guild)

            setTimeout(() => {
                timer.delete(guild)
            }, 1000 * timercooldown);
        }
    })
})

bot.on('chat', (username, message) => {
    if (username === bot.username) return
    if (message.includes('@')) return
    client.channels.cache.get(chatid).send(`<${username}> ${message}`)
})

client.login(token)
