const Levels = require("discord-xp");
const discord = require('discord.js');
const client = new discord.Client();
Levels.setURL(process.env.DB);
const config = require('./config.json')
const keepAlive = require('./server.js')
keepAlive();
const prefix = config.prefix

client.on('ready', () => {
  console.log("I am ready")
  client.user.setUsername('Your bot name')
  client.user.setPresence({ activity: {name:"Your name"}, status: "online"})
});

client.on("message", async (message) => {
 if (!message.guild) return;
 if (message.author.bot) return;
const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; 
const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
 if (hasLeveledUp) {
   const user = await Levels.fetch(message.author.id, message.guild.id);
   message.channel.send(`${message.author} ggs, now you are level **${user.level}**`);
 }
});

client.on("message", async (message) => {
if (message.content.startsWith(prefix + "rank")) {
const target = message.mentions.users.first() || message.author;
const user = await Levels.fetch(target.id, message.guild.id); 
if (!user) return message.channel.send("Seems like you have no experience"); 
let embed = new discord.MessageEmbed()
  .setTitle("Your Level")
  .setDescription(`**${target.tag}** is now level **${user.level} **`)
  .setFooter("ggs")
  .setTimestamp()
  .setColor("RANDOM")
message.channel.send(embed);

}
})

client.on("message", async (message) => {
if (message.content.startsWith(prefix + "leaderboard")) {
const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10); 
if (rawLeaderboard.length < 1) return reply("Nobody's level is high enough to be on it");
const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true); 
const lb = leaderboard.map(e => `**${e.position}**. **${e.username}#${e.discriminator}**\n**Level:**: ${e.level}\n**Xp:** ${e.xp.toLocaleString()}`); 

let embed = new discord.MessageEmbed()
  .setTitle("Leaderboard")
  .setDescription(lb)
  .setFooter("ggs")
  .setColor("RANDOM")
  .setTimestamp()
  message.channel.send(embed)
}
})

if(message.content === `${prefix} help`) {
    let embed = new discord.MessageEmbed()
    .setTitle("My commands")
    .setDescription("My commands:\n**rank, leaderboard, help**")
    .setFooter("ggs")
    .setTimestamp()
    .setColor("RANDOM")
    message.channel.send(embed)
  }

client.login(process.env.TOKEN)