//imports
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const embed = require('./embed.js')
const axios = require('axios')
const config = require('./config.json');
//parse aruments
const args = require('minimist')(process.argv.slice(2));
// define variables
const server = args.server;
var isdev = false;
let channel;
let roleId;
let ip;
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });

//set dev mode if args
if(args.dev === 1){
	isdev = true;
}

//get ip
axios.get(config.whatismyipurl)
.then(
	function (response) {
			ip = response.data.slice(0, -1)
	}
)


client.once('ready', () => {
	console.log('Ready!');
	console.log('logged as ' + client.user.username)
	//define a delay function
	function delay(time) {
		return new Promise(resolve => setTimeout(resolve, time));
	}
	//set the variables of channel and roles depending on dev mode
	if(isdev === true){
		const guild = client.guilds.cache.get(config.devGuildId)
		channel = guild.channels.cache.get(config.devChannelId)
		roleId = config.devRoleId
	} else {
		const guild = client.guilds.cache.get(config.servers[server].guildId)
		channel = guild.channels.cache.get(config.servers[server].channelId)
		roleId = config.servers[server].roleId
	}
	
	//send a ghost ping to the role 4,5 sec after the bot is ready
	delay(4500).then( () => channel.send("<@&" + roleId + ">"))
	.then(msg => {
		msg.delete({ timeout: 10 })
	  })
	
	//send the embed after 5 seconds
	delay(5000).then( () => channel.send({ embeds: [embed(ip, config.servers[server].iconurl, config.servers[server].name, config.servers[server].color)]}))
	
	//shut down the bot after 15 seconds
	delay(15000).then(() => process.exit(0));
});

//login to the bot depending of the dev mode
if(isdev === true){
	client.login(config.dev_token);
} else {
	client.login(config.release_token);
}