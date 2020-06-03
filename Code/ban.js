const Discord = require("discord.js");
const { red } = require("../config.json");
const moment = require("moment");

module.exports = {
    name: 'ban',
    description: 'Smack down that mf ban hammer',
    usage: '<user> | <reason>',
    cooldown: 5,
    class: 'moderation',
    args: true,
    execute(msg, args, con, linkargs) {
        const user = msg.mentions.users.first();
        if (!user) return msg.channel.send(`You didn't mention the user to ban`);     //If the command mentions a user
        const member = msg.guild.member(user);
        if (!member) return msg.channel.send("That user isn't in this server")       //If the user is in the server
        let reason = linkargs[1];
        if (!reason) {
            member.ban({
                reason: "They were bad!",
            }).then(async () => {
                let uicon = user.displayAvatarURL();
                let banEmbed = new Discord.MessageEmbed()      //Sends a fancy display of execution information
                    .setTitle(`**${user.username} was banned :(**`)
                    .setThumbnail(uicon)
                    .addField("Banned by:", msg.author.username)
                    .addField("Banned in:", msg.channel.name)
                    .addField("Time: ", moment().format(`LT`))
                    .setColor(red)
                msg.channel.send(banEmbed);
            }).catch(err => {
                console.error(err);
                return msg.channel.send("I don't have the permissions to ban them");
            });
        } else {
            member.ban({
                reason: reason,
            }).then(async () => {
                let uicon = user.displayAvatarURL();
                let banEmbed = new Discord.MessageEmbed()      //Sends a fancy display of execution information
                    .setTitle(`**${user.username} was banned :(**`)
                    .setDescription(`Reason:\n${reason}`)
                    .setThumbnail(uicon)
                    .addField("Banned by:", msg.author.username)
                    .addField("Banned in:", msg.channel.name)
                    .addField("Time: ", moment().format(`LT`))
                    .setColor(red)
                msg.channel.send(banEmbed);
            }).catch(err => {
                console.error(err);
                return msg.channel.send("I don't have the permissions to ban them");
            });
        }
    },
}