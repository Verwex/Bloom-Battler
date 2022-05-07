const sendCharmArray = async(channel, theArray) => {
	const generateEmbed = async start => {
		const current = theArray.slice(start, start + 6)
		return new Discord.MessageEmbed({
			title: `Showing results ${start + 1}-${start + current.length} out of ${theArray.length}`,
			fields: await Promise.all(
				current.map(async arrayDefs => ({
					name: `${arrayDefs.name}`,
					value: `**${arrayDefs.notches} Notches**\n*${arrayDefs.desc}*`
				}))
	
	///////////
	// Shops //
	///////////
    if (command === 'entershop') {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id))
			return message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!");
		
        if (!message.member.permissions.serialize().ADMINISTRATOR)
            return message.channel.send("You lack sufficient permissions, I'm so sorry!");

        const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (!arg[1]) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${prefix}entershop`)
				.setDescription('(Args <Party>)\nEnters a created shop with the specified party.')
            message.channel.send({embeds: [DiscordEmbed]})
            return false
        }
		
		let shopPath = `${dataPath}/Shops/shops-${message.guild.id}.json`
		let shopRead = fs.readFileSync(shopPath, {flag: 'as+'});
		let shopFile = JSON.parse(shopRead);   
		let btlPath = dataPath+'/Battles/battle-' + message.guild.id + '.json'
		let btlRead = fs.readFileSync(btlPath, {flag: 'as+'});
		let btl = JSON.parse(btlRead);
        let itemPath = dataPath+'/items.json'
        let itemRead = fs.readFileSync(itemPath, {flag: 'as+'});
        let itemFile = JSON.parse(itemRead);
        let servPath = dataPath+'/Server Settings/server.json'
        let servRead = fs.readFileSync(servPath, {flag: 'as+'});
        let servFile = JSON.parse(servRead);
		
        if (!servFile[message.guild.id]) {
            servFile[message.guild.id] = {
				prefix: "rpg!",
				limitbreaks: false,
				showtimes: false,
				onemores: false,
				currency: "Bloom Token",
				xprate: 1,
				damageFormula: "persona",
				levelUpFormula: "original",
				pvpstuff: {
					none: {},
					metronome: {},
					randskills: {},
					randstats: {},
					charfuck: {}
				},
				themes: {
					battle: [],
					advantage: [],
					disadvantage: [],
					bossfight: [],
					miniboss: [],
					strongfoe: [],
					finalboss: [],
					colosseum: [],
					colosseumstrong: [],
					pvp: [],
					victory: [],
					colosseumvictory: [],
					loss: []
				},
				banned: []
			}
        }
		
		let shop = shopFile[message.guild.id][message.channel.id]
		let servBtl = btl[message.guild.id]

		if (servBtl.parties[arg[1]]) {
			shop.party = arg[1]
			fs.writeFileSync(shopPath, JSON.stringify(shopFile, null, '    '));
		
			let itemString = `${servBtl.parties[arg[1]].rings} ${servFile[message.guild.id].currency}s\n\n`
			for (const i in shop.items) {
				let itemDefs = itemFile[shop.items[i]]
				itemString += `\n**${itemDefs.name}**\nCosts ${itemDefs.cost} ${servFile[message.guild.id].currency}s.\n*${itemDefs.desc}*\n`
			}

			let itemEmbed = new Discord.MessageEmbed()
				.setColor('#c2907e')
				.setTitle(`${shop.name}`)
				.setDescription(`*The shop has been opened!*\n${itemString}`)

			message.channel.send({content:`Team ${arg[1]} entered the shop.`,embeds:[itemEmbed]})
			message.delete()
		} else {
			message.channel.send("Invalid Party!")
			return false
		}
	}

    if (command === 'leaveshop') {
		let shopPath = `${dataPath}/Shops/shops-${message.guild.id}.json`
		let shopRead = fs.readFileSync(shopPath, {flag: 'as+'});
		let shopFile = JSON.parse(shopRead);
		let shop = shopFile[message.guild.id][message.channel.id];
		
        if (!message.member.permissions.serialize().ADMINISTRATOR) {
            message.channel.send("You lack sufficient permissions, I'm so sorry!");
            return
        }

		message.channel.send(`Team ${shop.party} left the shop.`)
		message.delete()

		shop.party = "none"
		fs.writeFileSync(shopPath, JSON.stringify(shopFile, null, '    '));
	}

    if (command === 'buyitem') {
        const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (!arg[1]) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${prefix}buyitem`)
				.setDescription('(Args <Item> <Quantity>)\nBuys an amount of the specified item.')
            message.channel.send({embeds: [DiscordEmbed]})
            return false
        }

		// so much shit ffs
		let shopPath = `${dataPath}/Shops/shops-${message.guild.id}.json`
        let itemPath = dataPath+'/items.json'
        let servPath = dataPath+'/Server Settings/server.json'
		let btlPath = dataPath+'/Battles/battle-' + message.guild.id + '.json'
		let shopRead = fs.readFileSync(shopPath, {flag: 'as+'});
        let itemRead = fs.readFileSync(itemPath, {flag: 'as+'});
        let servRead = fs.readFileSync(servPath, {flag: 'as+'});
		let btlRead = fs.readFileSync(btlPath, {flag: 'as+'});
		let shopFile = JSON.parse(shopRead);
        let itemFile = JSON.parse(itemRead);
        let servFile = JSON.parse(servRead);
		let btl = JSON.parse(btlRead);
		
		if (!shopFile[message.guild.id][message.channel.id].party || shopFile[message.guild.id][message.channel.id].party === "none") {
			message.channel.send("There's nobody in the shop!")
			message.delete()
			return false
		}
		
		if (!itemFile[arg[1]]) {
			message.channel.send("This item doesn't exist!")
			message.delete()
			return false
		}
		
		let hasItem = false
		for (const i in shopFile[message.guild.id][message.channel.id].items) {
			let itemName = shopFile[message.guild.id][message.channel.id].items[i]
			if (arg[1] == itemName) {
				hasItem = true
			}
		}
		
		if (hasItem == false) {
			message.channel.send("The shop isn't selling this item.")
			message.delete()
			return false
		}
		
		let totalCost = 0;
		let totalQuantity = arg[2] ? parseInt(arg[2]) : 1
		for (i = 1; i <= parseInt(arg[2]); i++)
			totalCost += itemFile[arg[1]].cost;
		
		let party = btl[message.guild.id].parties[shopFile[message.guild.id][message.channel.id].party]
		
		if (party.rings < totalCost) {
			message.channel.send(`The party doesn't have enough ${servFile[message.guild.id].currency}s! (Need ${totalCost})`)
			message.delete()
			return false
		}
		
		let itemName = itemFile[arg[1]].name
		
		party.rings -= totalCost
		if (!party.items[arg[1]])
			party.items[arg[1]] = 0;

		if (totalQuantity > 1)
			message.channel.send(`Team ${shopFile[message.guild.id][message.channel.id].party} bought **${totalQuantity} ${itemName}s**.\n*(${party.rings} ${servFile[message.guild.id].currency}s left.)*`);
		else
			message.channel.send(`Team ${shopFile[message.guild.id][message.channel.id].party} bought a **${itemName}**.\n*(${party.rings} ${servFile[message.guild.id].currency}s left.)*`);
		
		party.items[arg[1]] += totalQuantity
		fs.writeFileSync(btlPath, JSON.stringify(btl, null, '    '));
	}
	
	/////////////////
	// Blacksmiths //
	/////////////////
    if (command === 'registerblacksmith') {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id))
			return message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!")
		
        if (!message.member.permissions.serialize().ADMINISTRATOR)
            return message.channel.send("You lack sufficient permissions, I'm so sorry!");

        const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (!arg[1]) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${prefix}${command}`)
				.setDescription('(Args <Name> <Channel ID>)\nCreates a blacksmith that characters may create and enhance weapons with.')
            message.channel.send({embeds: [DiscordEmbed]})
            return false
        }

		if (!arg[2] || !client.channels.cache.get(arg[2]))
			return message.channel.send("Please specify a valid channel.");

		const shopChannel = client.channels.cache.get(arg[2])
		let blacksmithPath = `${dataPath}/BlackSmiths/blacksmith-${arg[2]}.json`
		let blacksmithRead = fs.readFileSync(blacksmithPath, {flag: 'as+'});
		
		if (blacksmithRead == '' || blacksmithRead == ' ')
			blacksmithRead = '{}';

		let blacksmithFile = JSON.parse(blacksmithRead);
        let itemPath = dataPath+'/items.json'
        let itemRead = fs.readFileSync(itemPath, {flag: 'as+'});
        let itemFile = JSON.parse(itemRead);
        let servPath = dataPath+'/Server Settings/server.json'
        let servRead = fs.readFileSync(servPath, {flag: 'as+'});
        let servFile = JSON.parse(servRead);
		
        if (!servFile[message.guild.id]) {
            servFile[message.guild.id] = {
				prefix: "rpg!",
				limitbreaks: false,
				showtimes: false,
				onemores: false,
				currency: "Bloom Token",
				xprate: 1,
				damageFormula: "persona",
				levelUpFormula: "original",
				pvpstuff: {
					none: {},
					metronome: {},
					randskills: {},
					randstats: {},
					charfuck: {}
				},
				themes: {
					battle: [],
					advantage: [],
					disadvantage: [],
					bossfight: [],
					miniboss: [],
					strongfoe: [],
					finalboss: [],
					colosseum: [],
					colosseumstrong: [],
					pvp: [],
					victory: [],
					colosseumvictory: [],
					loss: []
				},
				banned: []
			}
        }

		blacksmithFile = {
			name: arg[1],
			party: 'none',
			state: 'closed',
			text: {
				blacksmith: `??? - ${arg[1]}`,
				enter: ["Hey, welcome to the blacksmith's. We do weapons, armors and more!"],
				weapon: ["Would you like me to create some weapons, or enhance an existing one?"],
				armor: ["Would you like me to create some armors, or enhance an existing one?"],

				createWeapon: ["Which weapon do you think suits you?", "Any of these seem useful?"],
				enhanceWeapon: ["Want to get stronger? Why don't you enhance a weapon."],
				createArmor: ["Which set of armor do you think suits you?", "Any of these seem useful?"],
				enhanceArmor: ["Want to get stronger? Why don't you enhance an armor."],

				lackMaterial: ["You seem to lack the materials I need to do this, sorry."],
				lackMoney: ["You seem to be a little short on the money I want. Sorry."],

				decompose: ["I can also scrap some of your stuff back into materials, but I won't be able to salvage all of it."]
			}
		}

		fs.writeFileSync(blacksmithPath, JSON.stringify(blacksmithFile, null, '    '));

		let itemEmbed = new Discord.MessageEmbed()
			.setColor('#c2907e')
			.setTitle(`${blacksmithFile.name}`)
			.setDescription(`*The blacksmith has been opened!*`)
		shopChannel.send({embeds: [itemEmbed]})
	}
	
    if (command === 'enterblacksmith') {
		let blacksmithPath = `${dataPath}/BlackSmiths/${message.guild.id}/blacksmith-${arg[2]}.json`
		let blacksmithRead = fs.readFileSync(blacksmithPath, {flag: 'as+'});
		let blacksmithFile = JSON.parse(blacksmithRead);
		let btlPath = dataPath+'/Battles/battle-' + message.guild.id + '.json'
		let btlRead = fs.readFileSync(btlPath, {flag: 'as+'});
		let btl = JSON.parse(btlRead);
        let itemPath = dataPath+'/items.json'
        let itemRead = fs.readFileSync(itemPath, {flag: 'as+'});
        let itemFile = JSON.parse(itemRead);
        let servPath = dataPath+'/Server Settings/server.json'
        let servRead = fs.readFileSync(servPath, {flag: 'as+'});
        let servFile = JSON.parse(servRead);
		
        if (!servFile[message.guild.id]) {
            servFile[message.guild.id] = {
				prefix: "rpg!",
				limitbreaks: false,
				showtimes: false,
				onemores: false,
				currency: "Bloom Token",
				xprate: 1,
				damageFormula: "persona",
				levelUpFormula: "original",
				pvpstuff: {
					none: {},
					metronome: {},
					randskills: {},
					randstats: {},
					charfuck: {}
				},
				themes: {
					battle: [],
					advantage: [],
					disadvantage: [],
					bossfight: [],
					miniboss: [],
					strongfoe: [],
					finalboss: [],
					colosseum: [],
					colosseumstrong: [],
					pvp: [],
					victory: [],
					colosseumvictory: [],
					loss: []
				},
				banned: []
			}
        }

        const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (!arg[1]) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${prefix}entershop`)
				.setDescription('(Args <Party>)\nEnters a created shop with the specified party.')
            message.channel.send({embeds: [DiscordEmbed]})
            return false
        };
		
		if (!btl[message.guild.id].parties[arg[1]])
			return message.channel.send('No valid party was provided.')

		if (!blacksmithFile.name)
			return message.channel.send("There's no blacksmith here...");

		if (blackSmith[message.channel.id])
			return message.channel.send("Someone's in the blacksmith's already.")
		
		blacksmithFile.party = arg[1]
		blacksmithFile.state = 'enter'

		let bEmbed = new Discord.MessageEmbed()
			.setColor('#c2907e')
			.setTitle(`${blacksmithFile.blacksmith}`)
			.setDescription(`"${blacksmithFile.enter[Math.round(Math.random()*blacksmithFile.enter.length-1)]}"`)

		blackSmith[message.channel.id] = message.channel.send({embeds: [bEmbed]})
	}

	////////////
	// Chests //
	////////////

	if (command == 'openchest') {
		message.delete()

		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id)) {
			message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!")
			return false
		}
		
        if (!message.member.permissions.serialize().ADMINISTRATOR) {
            message.channel.send("You lack sufficient permissions, I'm so sorry!");
            return
        }

        const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (!arg[1]) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${prefix}openchest`)
				.setDescription('(Args <Chest Name> <Party>)\nOpens a created chest with the specified party.')
            message.channel.send({embeds: [DiscordEmbed]})
            return false
        }

		if (!arg[2]) {
            message.channel.send("Please specify a correct party.");
            return
        }

		let chestPath = dataPath+'/chests.json'
		let chestRead = fs.readFileSync(chestPath, {flag: 'as+'});
		let chestFile = JSON.parse(chestRead);
		let btlPath = dataPath+'/Battles/battle-' + message.guild.id + '.json'
		let btlRead = fs.readFileSync(btlPath, {flag: 'as+'});
		let btl = JSON.parse(btlRead);

		if (!chestFile[message.guild.id][message.channel.id][arg[1]]) {
			message.channel.send(`${arg[1]} does not exist in this channel. Please try somewhere else.`);
            return
		}

		if (!btl[message.guild.id].parties[arg[2]]) {
			message.channel.send("Invalid Party!")
			return false
		}

		let chestInput = chestFile[message.guild.id][message.channel.id][arg[1]]
		let partyInput = btl[message.guild.id].parties[arg[2]]

		let canOpen = false

		if (chestInput.locked == false) {
			canOpen = true
		} else if (chestInput.locked == true) {
			for (const i in partyInput.items) {
				if (chestInput.lockOpener == i) {
					canOpen = true
				}
			}
		}

		if (canOpen == false) {
			message.channel.send("You can't open this chest because you don't have the right item to open it with.")
			return false
		}

		chestInput.party = arg[2]
		chestInput.encountered = true
		fs.writeFileSync(chestPath, JSON.stringify(chestFile, null, '    '));

		let itemText = ''
		for (const i in chestInput.items) {
			itemText += `\n- ${i}: ${chestInput.items[i]}`
		}
		if (itemText == '')
			itemText = `None`

		let chestEmbed = new Discord.MessageEmbed()
			.setColor('#c2907e')
			.setTitle(`${arg[2]} has successfully opened ${arg[1]}`)
			.setFields(
				{name: `Items`, value: itemText, inline: false}
			)
		message.channel.send({embeds: [chestEmbed]})
	}

	if (command == 'closechest') {
		message.delete()

		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id)) {
			message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!")
			return false
		}
		
        if (!message.member.permissions.serialize().ADMINISTRATOR) {
            message.channel.send("You lack sufficient permissions, I'm so sorry!");
            return
        }

		const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (!arg[1]) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${prefix}closechest`)
				.setDescription('(Args <Chest Name>)\nCloses a created chest if it is open.')
            message.channel.send({embeds: [DiscordEmbed]})
            return false
        }

		let chestPath = dataPath+'/chests.json'
		let chestRead = fs.readFileSync(chestPath, {flag: 'as+'});
		let chestFile = JSON.parse(chestRead);
		let btlPath = dataPath+'/Battles/battle-' + message.guild.id + '.json'
		let btlRead = fs.readFileSync(btlPath, {flag: 'as+'});
		let btl = JSON.parse(btlRead);

		if (!chestFile[message.guild.id][message.channel.id][arg[1]]) {
			message.channel.send(`${arg[1]} does not exist in this channel. Please try somewhere else.`);
            return
		}

		let chestInput = chestFile[message.guild.id][message.channel.id][arg[1]]

		if (chestInput.party == "") {
			message.channel.send(`${arg[1]} is not open yet. Please open it first.`);
            return
		}

		message.channel.send(`${chestInput.party} has closed ${arg[1]}.`)
		chestInput.party = ""
		fs.writeFileSync(chestPath, JSON.stringify(chestFile, null, '    '));
	}

	if (command == 'takeitem') {
		message.delete()

		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id)) {
			message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!")
			return false
		}

		const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (!arg[1]) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${prefix}takeitem`)
				.setDescription(`(Args <Chest Name> <Item> <Optional: Quantity>)\nTake items from a chest, should it be open.\n\nYou can also do:\n${prefix}takeitem all to take all the items from the chest.`)
            message.channel.send({embeds: [DiscordEmbed]})
            return false
        }

		if (!arg[2]) {
			message.channel.send("Please specify what item you want to take, or if you want to take all of them.")
			return false
		}

		let chestPath = dataPath+'/chests.json'
		let chestRead = fs.readFileSync(chestPath, {flag: 'as+'});
		let chestFile = JSON.parse(chestRead);
		let itemPath = dataPath+'/items.json'
		let itemRead = fs.readFileSync(itemPath, {flag: 'as+'});
		let itemFile = JSON.parse(itemRead);
		let btlPath = dataPath+'/Battles/battle-' + message.guild.id + '.json'
		let btlRead = fs.readFileSync(btlPath, {flag: 'as+'});
		let btl = JSON.parse(btlRead);

		if (!chestFile[message.guild.id][message.channel.id][arg[1]]) {
			message.channel.send(`${arg[1]} does not exist in this channel. Please try somewhere else.`);
            return
		}

		let chestInput = chestFile[message.guild.id][message.channel.id][arg[1]]

		if (chestInput.party == "") {
			message.channel.send(`${arg[1]} is not open yet. Please open it first.`);
            return
		}

		let partyInput = btl[message.guild.id].parties[chestInput.party]

		if (arg[2] == 'All') {
			for (const item in itemFile) {
				for (const chestItem in chestInput.items) {
					if (chestItem == itemFile[item].name) {
						if (!partyInput.items[item]) {
							partyInput.items[item] = 0
						}

						partyInput.items[item] += chestInput.items[chestItem]
					}
				}
			}
			fs.writeFileSync(btlPath, JSON.stringify(btl, null, '    '));

			chestInput.items = {}

			fs.writeFileSync(chestPath, JSON.stringify(chestFile, null, '    '));
		} else {
			let quantity = 1

			if (!arg[3])
			quantity = 1

			quantity = parseInt(arg[3])

			if (!isFinite(parseInt(arg[3])))
			quantity = 1

			if (parseInt(arg[3]) < 1)
			quantity = 1

			if (!itemFile[arg[2]]) {
				message.channel.send(`${arg[2]} is not a valid item.`);
            	return
			}

			let canTake = false

			for (i in chestInput.items) {
				if (itemFile[arg[2]].name == i)
				canTake = true
			}

			if (canTake == false) {
				message.channel.send(`${arg[2]} is not in this chest yet.`);
            	return
			}

			if (quantity > chestInput.items[itemFile[arg[2]].name])
			quantity = chestInput.items[itemFile[arg[2]].name]

			chestInput.items[itemFile[arg[2]].name] -= quantity

			if (chestInput.items[itemFile[arg[2]].name] < 1)
			delete chestInput.items[itemFile[arg[2]].name]

			fs.writeFileSync(chestPath, JSON.stringify(chestFile, null, '    '));

			if (!partyInput.items[arg[2]]) {
				partyInput.items[arg[2]] = 0
			}

			partyInput.items[arg[2]] += quantity

			fs.writeFileSync(btlPath, JSON.stringify(btl, null, '    '));
		}

		let itemText = ''
		for (const i in chestInput.items) {
			itemText += `\n- ${i}: ${chestInput.items[i]}`
		}
		if (itemText == '')
			itemText = `None`

		let chestEmbed = new Discord.MessageEmbed()
			.setColor('#c2907e')
			.setTitle(`${chestInput.party} has successfully taken items from ${chestInput.name}`)
			.setFields(
				{name: `Items`, value: itemText, inline: false}
			)
		message.channel.send({embeds: [chestEmbed]})
	}

	if (command == 'putitem') {
		message.delete()

		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id)) {
			message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!")
			return false
		}

		const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (!arg[1]) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${prefix}putitem`)
				.setDescription(`(Args <Chest Name> <Item> <Optional: Quantity>)\nTake items from a party, and put them inside of a chest, should it be open.\n\nYou can also do:\n${prefix}putitem all to put all the items from the party into a chest.`)
            message.channel.send({embeds: [DiscordEmbed]})
            return false
        }

		if (!arg[2]) {
			message.channel.send("Please specify what item you want to take, or if you want to take all of them.")
			return false
		}

		let chestPath = dataPath+'/chests.json'
		let chestRead = fs.readFileSync(chestPath, {flag: 'as+'});
		let chestFile = JSON.parse(chestRead);
		let itemPath = dataPath+'/items.json'
		let itemRead = fs.readFileSync(itemPath, {flag: 'as+'});
		let itemFile = JSON.parse(itemRead);
		let btlPath = dataPath+'/Battles/battle-' + message.guild.id + '.json'
		let btlRead = fs.readFileSync(btlPath, {flag: 'as+'});
		let btl = JSON.parse(btlRead);

		if (!chestFile[message.guild.id][message.channel.id][arg[1]]) {
			message.channel.send(`${arg[1]} does not exist in this channel. Please try somewhere else.`);
            return
		}

		let chestInput = chestFile[message.guild.id][message.channel.id][arg[1]]

		if (chestInput.party == "") {
			message.channel.send(`${arg[1]} is not open yet. Please open it first.`);
            return
		}

		let partyInput = btl[message.guild.id].parties[chestInput.party]

		if (arg[2] == 'All') {
			for (const item in itemFile) {
				for (const partyItem in partyInput.items) {
					if (item == partyItem) {
						if (!chestInput.items[itemFile[item].name]) {
							chestInput.items[itemFile[item].name] = 0
						}

						chestInput.items[itemFile[item].name] += partyInput.items[partyItem]
					}
				}
			}

			fs.writeFileSync(chestPath, JSON.stringify(chestFile, null, '    '));

			partyInput.items = {}

			fs.writeFileSync(btlPath, JSON.stringify(btl, null, '    '));
		} else {
			let quantity = 1

			if (!arg[3])
			quantity = 1

			quantity = parseInt(arg[3])

			if (!isFinite(parseInt(arg[3])))
			quantity = 1

			if (parseInt(arg[3]) < 1)
			quantity = 1

			if (!itemFile[arg[2]]) {
				message.channel.send(`${arg[2]} is not a valid item.`);
            	return
			}

			let canPut = false

			for (i in partyInput.items) {
				if (arg[2] == i)
				canPut = true
			}

			if (canPut == false) {
				message.channel.send(`${arg[2]} is not an item in ${chestInput.party}'s inventory.`);
            	return
			}

			if (quantity > partyInput.items[arg[2]])
			quantity = partyInput.items[arg[2]]

			partyInput.items[arg[2]] -= quantity

			if (partyInput.items[arg[2]] < 1)
			delete partyInput.items[arg[2]]

			fs.writeFileSync(btlPath, JSON.stringify(btl, null, '    '));

			if (!chestInput.items[itemFile[arg[2]].name]) {
				chestInput.items[itemFile[arg[2]].name] = 0
			}

			chestInput.items[itemFile[arg[2]].name] += quantity

			fs.writeFileSync(chestPath, JSON.stringify(chestFile, null, '    '));
		}

		let itemText = ''
		for (const i in chestInput.items) {
			itemText += `\n- ${i}: ${chestInput.items[i]}`
		}
		if (itemText == '')
			itemText = `None`

		let chestEmbed = new Discord.MessageEmbed()
			.setColor('#c2907e')
			.setTitle(`${chestInput.party} has successfully put items from ${chestInput.name}`)
			.setFields(
				{name: `Items`, value: itemText, inline: false}
			)
		message.channel.send({embeds: [chestEmbed]})
	}

	/////////////////////
    // Battle Commands //
    /////////////////////
	
	if (command === 'fuseitem' || command === 'craftitem') {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id))
			return message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!");

        const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (!arg[1]) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
				.setTitle(`${prefix}${command}`)
				.setDescription("(Args <Team> <Crafted Item>)\nUse a team's items to craft an item.")

			return message.channel.send({embeds: [DiscordEmbed]})
        }
		
        let itemPath = dataPath+'/items.json'
        let itemRead = fs.readFileSync(itemPath, {flag: 'as+'});
        let itemFile = JSON.parse(itemRead);
		let btlPath = `${dataPath}/Battles/battle-${message.guild.id}.json`
		let btlRead = fs.readFileSync(btlPath, {flag: 'as+'});
		let btl = JSON.parse(btlRead);
		
		if (itemFile[arg[2]]) {
			let itemDefs = itemFile[arg[2]];

			if (!itemDefs.fusion || itemDefs.fusion === {})
				return message.channel.send(`${arg[2]} cannot be created.`)

			let partyDefs = btl[message.guild.id].parties[arg[1]];
			
			// Check if the party has the items required.
			let notEnough = false;
			for (const i in itemDefs.fusion) {
				if (partyDefs.items[i] && partyDefs.items[i] >= itemDefs.fusion[i]) {
					partyDefs.items[i] -= itemDefs.fusion[i];
					if (partyDefs.items[i] <= 0) delete partyDefs.items[i];
				} else {
					notEnough = true;
					break;
				}
			}
			
			if (notEnough == true) {
				let itemsRequired = '```diff'
				for (const i in itemDefs.fusion)
					itemsRequired += `\n${itemFile[i] ? itemFile[i].name : i} x${itemDefs.fusion[i]} (${partyDefs.items[i] ? partyDefs.items[i] : '0'}/${itemDefs.fusion[i]})`;
				
				itemsRequired += '```'

				var DiscordEmbed = new Discord.MessageEmbed()
					.setColor('#ff0033')
					.setTitle('Item Crafting')
					.setDescription(`Team ${arg[1]} don't have enough items!${itemsRequired}`)
				message.channel.send({embeds: [DiscordEmbed]})
				
				return;
			}
			
			if (!partyDefs.items[arg[2]])
				partyDefs.items[arg[2]] = 1;
			else
				partyDefs.items[arg[2]]++;

			var DiscordEmbed = new Discord.MessageEmbed()
				.setColor('#ffda47')
				.setTitle('Item Crafting')
				.setDescription(`Team ${arg[1]} made an ${arg[2]}!`)
			message.channel.send({embeds: [DiscordEmbed]})
			fs.writeFileSync(btlPath, JSON.stringify(btl, null, '    '));	
		} else
			return message.channel.send(`${arg[2]} is an invalid item.`)
	}
	
    if (command === 'listcharms') {
        let charmPath = dataPath+'/charms.json'
        let charmRead = fs.readFileSync(charmPath, {flag: 'as+'});
        let charmFile = JSON.parse(charmRead);

		let itemArray = []
        const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (!arg[1] || arg[1] === ' ' || arg[1] === 'null') {
			for (const i in charmFile)
				itemArray.push(charmFile[i]);

			sendCharmArray(message.channel, itemArray);
        } else {
			for (const i in charmFile) {
				if (charmFile[i].name && charmFile[i].name.includes(arg[1]))
					itemArray.push(charmFile[i]);
			}
			
			if (itemArray.length <= 0)
				return message.channel.send('No found charms.')

			sendCharmArray(message.channel, itemArray);
		}
	}

    if (command === 'equipweapon') {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id))
			return message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!");

        const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (arg[1] == null) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#4b02c9')
				.setTitle(`${prefix}${command}`)
				.setDescription('(Args <CharName> <PartyName> <WeaponName>)\nIf the party has this weapon, the specified character can equip it.')
            return message.channel.send({embeds: [DiscordEmbed]})
        }

		let charPath = dataPath+'/characters.json'
		let charRead = fs.readFileSync(charPath, {flag: 'as+'});
		let charFile = JSON.parse(charRead);
		let btlPath = dataPath+'/Battles/battle-' + message.guild.id + '.json'
		let btlRead = fs.readFileSync(btlPath, {flag: 'as+'});
		let btl = JSON.parse(btlRead);

        if (btl[message.guild.id].parties[arg[2]]) {
			let partyDefs = btl[message.guild.id].parties[arg[2]];
			
			if (!charFile[arg[1]])
				return message.channel.send(`${arg[1]} is an invalid character!`);
			
			let inParty = false;
			for (const i in partyDefs.members) {
				if (partyDefs.members[i] === arg[1])
					inParty = true;
			}

			if (inParty == false)
				return message.channel.send(`${arg[1]} isn't in Team ${arg[2]}.`);

			let charDefs = charFile[arg[1]]

			if (!partyDefs.weapons)
				return message.channel.send(`Team ${arg[2]} doesn't have any weapons.`);

			if (!partyDefs.weapons[arg[3]])
				return message.channel.send(`Team ${arg[2]} doesn't have a ${arg[3]}.`);
			
			if (partyDefs.weapons[arg[3]].equipped)
				return message.channel.send(`${partyDefs.weapons[arg[3]].equipped} already has this weapon equipped.`);
			
			partyDefs.weapons[arg[3]].equipped = arg[1];
			message.channel.send(`👍 ${arg[1]} equipped the ${arg[3]}`);
			fs.writeFileSync(dataPath+`/Battles/battle-${message.guild.id}.json`, JSON.stringify(btl, null, '    '))
        } else
            return message.channel.send(`${arg[2]} isn't a valid party.`);
    }

    if (command === 'unequipweapon' || command === 'removeweapon') {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id))
			return message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!");

        const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (arg[1] == null) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#4b02c9')
				.setTitle(`${prefix}${command}`)
				.setDescription('(Args <CharName> <PartyName> <WeaponName>)\nIf the party has this weapon, the specified character can unequip it.')
            return message.channel.send({embeds: [DiscordEmbed]})
        }

		let charPath = dataPath+'/characters.json'
		let charRead = fs.readFileSync(charPath, {flag: 'as+'});
		let charFile = JSON.parse(charRead);
		let btlPath = dataPath+'/Battles/battle-' + message.guild.id + '.json'
		let btlRead = fs.readFileSync(btlPath, {flag: 'as+'});
		let btl = JSON.parse(btlRead);

        if (btl[message.guild.id].parties[arg[2]]) {
			let partyDefs = btl[message.guild.id].parties[arg[2]];
			
			if (!charFile[arg[1]])
				return message.channel.send(`${arg[1]} is an invalid character!`);
			
			let inParty = false;
			for (const i in partyDefs.members) {
				if (partyDefs.members[i] === arg[1])
					inParty = true;
			}

			if (inParty == false)
				return message.channel.send(`${arg[1]} isn't in Team ${arg[2]}.`);

			let charDefs = charFile[arg[1]]

			if (!partyDefs.weapons)
				return message.channel.send(`Team ${arg[2]} doesn't have any weapons.`);

			if (!partyDefs.weapons[arg[3]])
				return message.channel.send(`Team ${arg[2]} doesn't have a ${arg[3]}.`);

			delete partyDefs.weapons[arg[3]].equipped;
			message.channel.send(`👍 ${arg[1]} unequipped the ${arg[3]}`);
			fs.writeFileSync(dataPath+`/Battles/battle-${message.guild.id}.json`, JSON.stringify(btl, null, '    '))
        } else
            return message.channel.send(`${arg[2]} isn't a valid party.`);
    }

    if (command === 'equiparmor') {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id))
			return message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!");

        const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (arg[1] == null) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#4b02c9')
				.setTitle(`${prefix}${command}`)
				.setDescription('(Args <CharName> <PartyName> <ARmorName>)\nIf the party has this set of armor, the specified character can equip it.')
            return message.channel.send({embeds: [DiscordEmbed]})
        }

		let charPath = dataPath+'/characters.json'
		let charRead = fs.readFileSync(charPath, {flag: 'as+'});
		let charFile = JSON.parse(charRead);
		let btlPath = dataPath+'/Battles/battle-' + message.guild.id + '.json'
		let btlRead = fs.readFileSync(btlPath, {flag: 'as+'});
		let btl = JSON.parse(btlRead);

        if (btl[message.guild.id].parties[arg[2]]) {
			let partyDefs = btl[message.guild.id].parties[arg[2]];

			if (!charFile[arg[1]])
				return message.channel.send(`${arg[1]} is an invalid character!`);

			let inParty = false;
			for (const i in partyDefs.members) {
				if (partyDefs.members[i] === arg[1])
					inParty = true;
			}

			if (inParty == false)
				return message.channel.send(`${arg[1]} isn't in Team ${arg[2]}.`);

			let charDefs = charFile[arg[1]]

			if (!partyDefs.armors)
				return message.channel.send(`Team ${arg[2]} doesn't have any armors.`);

			if (!partyDefs.armors[arg[3]])
				return message.channel.send(`Team ${arg[2]} doesn't have a ${arg[3]}.`);
			
			if (partyDefs.armors[arg[3]].equipped)
				return message.channel.send(`${partyDefs.armors[arg[3]].equipped} already has this set of armor equipped.`);
			
			partyDefs.armors[arg[3]].equipped = arg[1];
			message.channel.send(`👍 ${arg[1]} equipped the ${arg[3]}`);
			fs.writeFileSync(dataPath+`/Battles/battle-${message.guild.id}.json`, JSON.stringify(btl, null, '    '))
        } else
            return message.channel.send(`${arg[2]} isn't a valid party.`);
    }

    if (command === 'unequiparmor' || command === 'removearmor') {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id))
			return message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!");

        const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (arg[1] == null) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#4b02c9')
				.setTitle(`${prefix}${command}`)
				.setDescription('(Args <CharName> <PartyName> <ArmorName>)\nIf the party has this set of armor, the specified character can equip it.')
            return message.channel.send({embeds: [DiscordEmbed]})
        }

		let charPath = dataPath+'/characters.json'
		let charRead = fs.readFileSync(charPath, {flag: 'as+'});
		let charFile = JSON.parse(charRead);
		let btlPath = dataPath+'/Battles/battle-' + message.guild.id + '.json'
		let btlRead = fs.readFileSync(btlPath, {flag: 'as+'});
		let btl = JSON.parse(btlRead);

        if (btl[message.guild.id].parties[arg[2]]) {
			let partyDefs = btl[message.guild.id].parties[arg[2]];
			
			if (!charFile[arg[1]])
				return message.channel.send(`${arg[1]} is an invalid character!`);
			
			let inParty = false;
			for (const i in partyDefs.members) {
				if (partyDefs.members[i] === arg[1])
					inParty = true;
			}

			if (inParty == false)
				return message.channel.send(`${arg[1]} isn't in Team ${arg[2]}.`);

			let charDefs = charFile[arg[1]]

			if (!partyDefs.armors)
				return message.channel.send(`Team ${arg[2]} doesn't have any armors.`);

			if (!partyDefs.armors[arg[3]])
				return message.channel.send(`Team ${arg[2]} doesn't have a ${arg[3]}.`);

			delete partyDefs.armors[arg[3]].equipped;
			message.channel.send(`👍 ${arg[1]} unequipped the ${arg[3]}`);
			fs.writeFileSync(dataPath+`/Battles/battle-${message.guild.id}.json`, JSON.stringify(btl, null, '    '))
        } else
            return message.channel.send(`${arg[2]} isn't a valid party.`);
    }

	if (command === 'fullheal') {
		if (!utilityFuncs.RPGBotAdmin(message.author.id)) {
			message.channel.send("You have insufficient permissions to do this.")
			return false
		}

		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id)) {
			message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!")
			return false
		}

        const arg = message.content.slice(prefix.length).trim().split(/ +/);
		
		let charPath = dataPath+'/characters.json'
		let charRead = fs.readFileSync(charPath, {flag: 'as+'});
		let charFile = JSON.parse(charRead);
		if (!arg[1]) {
			for (const i in charFile) {
				charFile[i].hp = charFile[i].maxhp
				charFile[i].mp = charFile[i].maxmp
			}
		} else {
			let btlPath = `${dataPath}/Battles/battle-${message.guild.id}.json`
			let btlRead = fs.readFileSync(btlPath, {flag: 'as+'});
			let btl = JSON.parse(btlRead);

			if (!btl[message.guild.id].parties[arg[1]])
				return message.channel.send(`${arg[1]} is a nonexistant team!`)

			if (btl[message.guild.id].parties[arg[1]].members.length <= 0)
				return message.channel.send(`${arg[1]} is an empty party!`)

			for (const i in btl[message.guild.id].parties[arg[1]].members) {
				let name = btl[message.guild.id].parties[arg[1]].members[i];

				if (charFile[name]) {
					charFile[name].hp = charFile[name].maxhp
					charFile[name].mp = charFile[name].maxmp
				}
			}
		}

		fs.writeFileSync(charPath, JSON.stringify(charFile, null, '    '));
		message.react('👍')
	}
	
	if (command === 'orderskills') {
		if (!utilityFuncs.RPGBotAdmin(message.author.id)) {
			message.channel.send("You have insufficient permissions to do this.")
			return false
		}
		
		utilityFuncs.orderSkills();
		message.react('👍');
	}
	
	/*
		CHARACTER Functions
	*/

    if (command === 'trustxp') {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id)) {
			message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!")
			return false
		}

        const arg = message.content.slice(prefix.length).trim().split(/ +/);
		
		let charPath = dataPath+'/characters.json'
		let charRead = fs.readFileSync(charPath, {flag: 'as+'});
		let charFile = JSON.parse(charRead);
		if (charFile[arg[1]] && charFile[arg[2]]) {
			if (parseInt(arg[3]) > 999999) message.channel.send('The value added was lowered to 999999, as adding too much at one time would slow me down!');

			charFuncs.trustUp(charFile[arg[1]], charFile[arg[2]], Math.min(999999, parseInt(arg[3])), message.guild.id, client)
			fs.writeFileSync(charPath, JSON.stringify(charFile, null, '    '));
			message.react('👍')

			setTimeout(function() {
				message.delete()
			}, 2000)
		} else {
			message.channel.send("One of two characters are nonexistant.")
			message.delete()
		}
	}

    if (command === 'findcharm') {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id))
			return message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!");
        if (!message.member.permissions.serialize().ADMINISTRATOR)
            return message.channel.send('You lack sufficient permissions, apologies!');

        const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (arg[1] == null) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#4b02c9')
				.setTitle(`${prefix}${command}`)
				.setDescription('(Args <Name> <Charm>)\nThe specified character locates this charm and is able to use it.')
            return message.channel.send({embeds: [DiscordEmbed]})
        }

		let charPath = dataPath+'/characters.json'
		let charRead = fs.readFileSync(charPath, {flag: 'as+'});
		let charFile = JSON.parse(charRead);

        if (charFile[arg[1]]) {
			const charDefs = charFile[arg[1]]
            if (!utilityFuncs.RPGBotAdmin(message.author.id)) {
                if (charDefs.owner && message.author.id != charDefs.owner) {
                    message.channel.send("You can't edit someone else's character!")
					message.delete()
                    return false
                }
            }

			let hasCharm
			for (const i in charDefs.curCharms) {
				if (arg[2] && charDefs.curCharms[i] == arg[2])
					hasCharm = true;
			}
			
			if (hasCharm) {
				message.channel.send(`${arg[1]} already has ${arg[2]}!`);
				message.delete()
				return false
			}

			let charmPath = dataPath+'/charms.json'
			let charmRead = fs.readFileSync(charmPath, {flag: 'as+'});
			let charmFile = JSON.parse(charmRead);

			if (!charmFile[arg[2]]) {
				message.channel.send(`${arg[2]} is an invalid charm.`)
				message.delete()
				return false
			}

			charDefs.curCharms.push(arg[2])

			message.channel.send(`${arg[1]} found the ${charmFile[arg[2]].name} charm!`);
			fs.writeFileSync(charPath, JSON.stringify(charFile, null, '    '));
			
			message.delete()
        } else
            return message.channel.send(`${arg[1]} isn't a valid character.`);
    }

    if (command === 'equipcharm') {
		if (utilityFuncs.isBanned(message.author.id, message.guild.id) && !utilityFuncs.RPGBotAdmin(message.author.id))
			return message.channel.send("I've been told you were banned from using the RPG sections of the bot, sorry!");

        const arg = message.content.slice(prefix.length).trim().split(/ +/);
        if (arg[1] == null) {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#4b02c9')
				.setTitle(`${prefix}${command}`)
				.setDescription('(Args <Name> <Charm>)\nLets this character use this charm if they have it.')
            return message.channel.send({embeds: [DiscordEmbed]})
        }

		let charPath = dataPath+'/characters.json'
		let charRead = fs.readFileSync(charPath, {flag: 'as+'});
		let charFile = JSON.parse(charRead);

        if (charFile[arg[1]]) {
			const charDefs = charFile[arg[1]]
            if (!utilityFuncs.RPGBotAdmin(message.author.id)) {
                if (charDefs.owner && message.author.id != charDefs.owner) {
                    message.channel.send("You can't edit someone else's character!")
                    return false
                }
            }

			let hasCharm
			for (const i in charDefs.curCharms) {
				if (arg[2] && charDefs.curCharms[i] == arg[2])
					hasCharm = true;
			}
			
			if (!hasCharm)
				return message.channel.send(`${arg[1]} does not have ${arg[2]}!`);

			let charmPath = dataPath+'/charms.json'
			let charmRead = fs.readFileSync(charmPath, {flag: 'as+'});
			let charmFile = JSON.parse(charmRead);

			if (!charmFile[arg[2]])
				return message.channel.send(`${arg[2]} is an invalid charm.`)
			
			let notches = 0
			for (const i in charDefs.charms)
				notches += charmFile[charDefs.charms[i]].notches
			
			notches += charmFile[arg[2]].notches
			
			if (notches > charFuncs.needNotches(charDefs.level))
				return message.channel.send(`${charDefs.name} can only use ${charFuncs.needNotches(charDefs.level)} notches! Using this charm would require ${notches} notches.`)

			charDefs.charms.push(arg[2])

			message.channel.send(`👍 ${arg[1]} equipped ${arg[2]}`);
			fs.writeFileSync(charPath, JSON.stringify(charFile, null, '    '));
        } else
            return message.channel.send(`${arg[1]} isn't a valid character.`);
    }

    if (command === 'maketrial') {
        if (!message.member.permissions.serialize().ADMINISTRATOR)
            return message.channel.send("You lack sufficient permissions, I'm so sorry!");
		
		const arg = message.content.slice(prefix.length).trim().split(/ +/);
		
		let btl = readBattle(message.guild.id);
		btl[message.guild.id].trials[arg[1]] = {
			endless: false,
			waves: [
				["Miniscle"]
			]
		}
		
        fs.writeFileSync(dataPath+'/Battles/battle-' + message.guild.id + '.json', JSON.stringify(btl, null, '    '));
		
		message.channel.send(`Created Trial ${arg[1]}, You can edit them with ${prefix}setwave!`);
	}

    if (command === 'setendless') {
        if (!message.member.permissions.serialize().ADMINISTRATOR)
            return message.channel.send("You lack sufficient permissions, I'm so sorry!");
		
		const arg = message.content.slice(prefix.length).trim().split(/ +/);

		let btl = readBattle(message.guild.id);
		btl[message.guild.id].trials[arg[1]].endless = (btl[message.guild.id].trials[arg[1]].endless == true) ? false : true
		
        fs.writeFileSync(dataPath+'/Battles/battle-' + message.guild.id + '.json', JSON.stringify(btl, null, '    '));
		message.channel.send(`Endless Mode for Trial ${arg[1]} has been toggled to ${btl[message.guild.id].trials[arg[1]].endless}.`);
	}
	
    if (command === 'setwave') {
        if (!message.member.permissions.serialize().ADMINISTRATOR)
            return message.channel.send("You lack sufficient permissions, I'm so sorry!");

		const arg = message.content.slice(prefix.length).trim().split(/ +/);

		if (!arg[1] || arg[1] === ' ' || arg[1] === 'null') {
            const DiscordEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
				.setTitle(`${prefix}setwave`)
				.setDescription(`(Args <Trial Name> <Wave Number> <...>)\nCreates a wave of enemies for the specified Trial.\n**The Trial has to exist though!** *(You can make it exist with ${prefix}maketrial.)*`);

			return message.channel.send({embeds: [DiscordEmbed]})
        }
		
		let btl = readBattle(message.guild.id);
		if (btl[message.guild.id].trials[arg[1]].waves) {
			let trialDefs = []
			for (let i = 3; i < arg.length; i++) {
				if (readEnm(arg[i], message.guild.id)) {
					trialDefs.push(arg[i])
				} else {
					message.channel.send(`${arg[i]} is an invalid enemy.`)
					return false
				}
			}
			
			if (!btl[message.guild.id].trials[arg[1]].waves[parseInt(arg[2])-1]) {
				message.channel.send("This wave does not exist, therefore, I have just slotted it in as the next wave for you.")
				btl[message.guild.id].trials[arg[1]].waves.push(trialDefs)
			} else {
				btl[message.guild.id].trials[arg[1]].waves[parseInt(arg[2])-1] = trialDefs
			}

			fs.writeFileSync(dataPath+'/Battles/battle-' + message.guild.id + '.json', JSON.stringify(btl, null, '    '));
			
			message.channel.send("Thank you for waiting!!!\nHere's the trial so far:")
			const trialEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`Trial of ${arg[1]}`)
				.addFields()
				
			let trialDefinitions = btl[message.guild.id].trials[arg[1]].waves
			for (const i in trialDefinitions) {
				let trialEnemies = ""
				for (const k in trialDefinitions[i]) {
					trialEnemies += `${trialDefinitions[i][k]}\n`
				}
				
				trialEmbed.fields.push({name: `Wave ${+i+1}`, value: `${trialEnemies}`, inline: true})
			}
			
			message.channel.send({embeds: [trialEmbed]})
		} else {
			message.channel.send("This trial does not exist.")
		}
	}

    if (command === 'gettrial') {
		let btl = readBattle(message.guild.id);
		const arg = message.content.slice(prefix.length).trim().split(/ +/);
		if (btl[message.guild.id].trials[arg[1]]) {
			let descTxt = 'Here are the waves of the trial.';
			if (btl[message.guild.id].trials[arg[1]].endless)
				descTxt += `\n**Endless:** *${btl[message.guild.id].trials[arg[1]].endless}*`;

			const trialEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`Trial of ${arg[1]}`)
				.setDescription(descTxt)
				.addFields()

			const trialDefs = btl[message.guild.id].trials[arg[1]].waves
			for (const i in trialDefs) {
				let trialEnemies = ""
				for (const k in trialDefs[i]) {
					trialEnemies += `${trialDefs[i][k]}\n`
				}
				
				trialEmbed.fields.push({name: `Wave ${+i+1}`, value: `${trialEnemies}`, inline: true})
			}
			
			message.channel.send({embeds: [trialEmbed]})
		} else {
			message.channel.send("This is an invalid trial!")
		}
	}