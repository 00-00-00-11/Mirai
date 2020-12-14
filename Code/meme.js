const Discord = require("discord.js");
const superagent = require('superagent');
const { loadmeme, darkgreen } = require("../config.json");

module.exports = {
    name: 'meme',
    description: 'Pull a random meme from r/dankmemes',
    usage: '',
    cooldown: 5,
    class: 'fun',
    args: false,
    async execute(msg, args, con, linkargs, client, catchErr) {
        const loading = client.emojis.cache.get(loadmeme);
        let gen = await msg.channel.send(`Generating... ${loading}`);
        try {
            const { body } = await superagent
                .get('https://www.reddit.com/r/dankmemes.json?sort=hot').catch(err => {
                    catchErr(err, msg, `${module.exports.name}.js`, "Dev")
                    gen.delete();
                    return;
                });
            const allowed = msg.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
            if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
            const randomnumber = Math.floor(Math.random() * allowed.length);
            let chosen = allowed[randomnumber].data.url;
            let chosentitle = allowed[randomnumber].data.title;
            let chosenlink = allowed[randomnumber].data.permalink;
            const memembed = new Discord.MessageEmbed()
                .setColor(darkgreen)
                .setTitle(chosentitle)
                .setImage(chosen)
                .setURL("https://www.reddit.com" + chosenlink)
                .setFooter("Memes provided by courtesy of r/dankmemes")
            msg.channel.send(memembed);
            gen.delete();
        } catch (err) {
            gen.delete();
            catchErr(err, msg, `${module.exports.name}.js`, "Sorry I had trouble getting memes from r/dankmemes, please try again later!")
            return;
        }
    },
}