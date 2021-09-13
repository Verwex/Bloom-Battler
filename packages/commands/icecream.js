// Require
const Discord = require('discord.js');
const Canvas = require('canvas');

const iceCreamFlavors = [
    'Chocolate',
    'Vanilla'
]

async function iceCream(scoops, repeatScoops, message) {

    var iceCreamInput = [...iceCreamFlavors]
    let iceCreamResults = []
    var iceCreamFlavorList = ''

    for (var i = 1; i <= scoops; i++) {

        if (iceCreamInput.length < 1) {
            iceCreamInput = [...iceCreamFlavors]
            console.log(`Oops. Ran out of ice cream flavors. Repeating the list.`)
        }

        var flavorNum = Math.floor(Math.random() * iceCreamInput.length)

        iceCreamResults.push(iceCreamInput[flavorNum])
        if (iceCreamResults.length <= 8)
            iceCreamFlavorList += `\n- ${iceCreamInput[flavorNum]}`

        if (repeatScoops == 'false')
            iceCreamInput.splice(flavorNum, 1)
    }

    console.log(`Flavors: ${iceCreamResults}`)

    var filtered = new Set(iceCreamResults);
	var iceCreamFiltered = [...filtered]
    var iceCreamName = iceCreamFiltered.join(' ');

    if (iceCreamResults.length > 8)
        iceCreamFlavorList = `*Too many scoops in this field.*`

    ///////////
    // IMAGE //
    ///////////

    const canvas = Canvas.createCanvas(201, 330 + (75 * iceCreamResults.length));
    const context = canvas.getContext('2d');

	// Since the image takes time to load, you should await it
	const cone = await Canvas.loadImage('./images/icecream/cone.png')

	// This uses the canvas dimensions to stretch the image onto the entire canvas
    var coneY = canvas.height - 330
	context.drawImage(cone, 20, coneY, 161, 322);

    var lastScoopY
    for (var i = 1; i <= scoops; i++) {
        const scoop = await Canvas.loadImage('./images/icecream/scoop.png')

        lastScoopY = coneY - 57 - 75 * (i-1)
        context.drawImage(scoop, 20, lastScoopY, 161, 155);
    }

	// Use the helpful Attachment class structure to process the file for you
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'icecream-result.png');

    embed = new Discord.MessageEmbed()
			.setColor('#F0B2ED')
			.setTitle(`${iceCreamName}`)
            .addFields(
                { name: 'Scoops', value: `${scoops}`, inline: true },
                { name: 'Flavors', value: `${iceCreamFlavorList}`, inline: true },
            )
            .setImage(`attachment://icecream-result.png`)
			.setFooter(`Ice Cream`);

    return message.channel.send({embeds: [embed], files: [attachment]})
}

// Export Functions
module.exports = {
	getIceCream: function (scoops, repeatScoops, message) {
		return iceCream(scoops, repeatScoops, message)
	},
}