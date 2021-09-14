// Require
const Discord = require('discord.js');
const Canvas = require('canvas');

const sauces = [
    'Traditional',
    'Pesto',
    'Olive Oil and Garlic',
    'White',
    'Mayo',
    'BBQ',
    'Ranch Dressing',
    'Hamburger',
    'Salsa',
    'Buffalo',
    'Sweet Chili',
    'Teriyaki',
    'Fig Jam',
    'Greek Yoghurt',
    'Bolognese',
    'Mystery'
]

const cheeses = [
    'Mozarella',
    'Provolone',
    'Cheddar',
    'Parmesan',
    'Gouda',
    'Goat',
    'Gruyere',
    'Ricotta',
    'Four Cheese',
    'Mimolette',
    'Russian',
    'Red Leicester',
    'Colby-Jack'
]

const toppingTypes = [
    "``you``",
    "``your mom lol``",
    'Toast',
    'Rosemary',
    'Biscuits',
    'Corn',
    'Squid',
    'Chocolate Curls',
    'Sewage',
    'Salt',
    'Pepper',
    'Scallions',
    'Feta',
    'Almonds',
    'French Fries',
    'Garlic',
    'Basil',
    'Oregano',
    'Broccoli',
    'Chili Peppers',
    'Salmon',
    'Clams',
    'Chili Powder',
    'Anchovies',
    'Fried Eggs',
    'Hard Boiled Eggs',
    'Overboiled Eggs',
    'Black Caviar',
    'Red Caviar',
    'Green Onion',
    'Onion',
    'Red Onion',
    'Purple Onion',
    'Peas',
    'Pepperoni',
    'Green Pepperoni',
    'Tuna',
    'Olives',
    'Black Olives',
    'Capers',
    'Salami',
    'Tomatoes',
    'Cherry Tomatoes',
    'Kimchi',
    'Mochi',
    'Rice',
    'Sesame Seeds',
    'Black Sesame Seeds',
    'Natto',
    'Nori',
    'Arugula',
    'Artichoke',
    'Ham',
    'Heavy Cream',
    'Pineapple Cream',
    'Sour Cream',
    'Pepper Cream',
    'Truffle Cream',
    'Beef Carpaccio',
    'Eggplant',
    'Parsley',
    'Mussels',
    'Tiger Prawns',
    'Shrimp',
    'Frutti di Mare',
    'Champignons',
    'Bacon',
    'Prosciutto',
    'Oyster',
    'Salsiccia',
    'Trevisano Radicchio',
    'Spinach',
    'Truffle',
    'Bell Pepper',
    'German Sausage',
    'Veal Schnitzel',
    'Anchovy Fillets',
    'Pecorino Romano',
    'Tiny Eggs',
    'Kit Kat',
    'Hokkaido Slices',
    'Seaweed',
    'Eel',
    'Leek',
    'Marshmallow',
    'Potato',
    'Wonton Wrappers',
    'Chicken',
    'Chicken Breast Cutlets',
    'Cauliflower',
    'Ground Beef',
    'Lettuce',
    'Pickles',
    'Habanero Pepper',
    'Pineapple',
    'Meatballs',
    'Black Beans',
    'Beans',
    'Dill',
    'Lime',
    'Lemon',
    'Lemon Juice',
    'Lime Juice',
    'Mango'
]

const condimentTypes = [
    'Ketchup',
    'Thousand Island Sauce',
    'Fig Jam',
    'BBQ Sauce',
    'Green Ketchup',
    'Purple Ketchup',
    'Sriracha',
    'Mayonnaise',
    'Garlic Sauce',
    'Greek Yoghurt'
]

async function pizza(toppings, repeatToppings, condiments, repeatCondiments, allowCheese, allowSauce, message) {

    if (allowSauce == 'true')
        var sauce = sauces[Math.floor(Math.random() * sauces.length)]
    else
        var sauce = "No Sauce"

    if (allowCheese == 'true')
        var cheese = cheeses[Math.floor(Math.random() * cheeses.length)]
    else
        var cheese = "No Cheese"

    //Toppings
    var toppingInput = [...toppingTypes]
    let toppingResults = []
    var toppingList = ''

    for (var i = 1; i <= toppings; i++) {

        if (toppingInput.length < 1) {
            toppingInput = [...toppingTypes]
            console.log(`Oops. Ran out of pizza toppings. Repeating the list.`)
        }

        var toppingNum = Math.floor(Math.random() * toppingInput.length)

        toppingResults.push(toppingInput[toppingNum])
        toppingList += `\n- ${toppingInput[toppingNum]}`

        if (repeatToppings == 'false')
            toppingInput.splice(toppingNum, 1)
    }

    console.log(`Toppings: ${toppingResults}`)

    var filteredA = new Set(toppingResults);
	var toppingsFilteres = [...filteredA]
    var toppingName = toppingsFilteres.join(' ');

    //Condiments
    var condimentInput = [...condimentTypes]
    let condimentResults = []
    var condimentList = ''

    for (var i = 1; i <= condiments; i++) {

        if (condimentInput.length < 1) {
            condimentInput = [...condimentTypes]
            console.log(`Oops. Ran out of pizza condiments. Repeating the list.`)
        }

        var condimentNum = Math.floor(Math.random() * condimentInput.length)

        condimentResults.push(condimentInput[condimentNum])
        condimentList += `\n- ${condimentInput[condimentNum]}`

        if (repeatCondiments == 'false')
            condimentInput.splice(condimentNum, 1)
    }

    console.log(`Condiments: ${condimentResults}`)

    ///////////
    // IMAGE //
    ///////////

    const canvas = Canvas.createCanvas(180, 180);
    const context = canvas.getContext('2d');

    function drawRotated(degrees, image){
        context.save();
    
        context.translate(canvas.width/2,canvas.height/2);
    
        context.rotate(degrees*Math.PI/180);
    
        context.drawImage(image,-image.width/2,-image.width/2);
    
        context.restore();
    }

    //crust
	const crustDraw = await Canvas.loadImage('./images/foodgenerators/pizza/crust.png')
	drawRotated(0, crustDraw)
    //sauce
    if (allowSauce == 'true') {
        const sauceDraw = await Canvas.loadImage(`./images/foodgenerators/pizza/sauces/${sauce}.png`)
        drawRotated(Math.random() * 360, sauceDraw)
    }
    //cheese
    if (allowCheese == 'true') {
        const cheeseDraw = await Canvas.loadImage(`./images/foodgenerators/pizza/cheeses/${cheese}.png`)
        drawRotated(Math.random() * 360, cheeseDraw)
    }
    //toppings
    for (var i = 1; i <= toppings; i++) {
        const toppingDraw = await Canvas.loadImage(`./images/foodgenerators/pizza/toppings/${toppingResults[toppingResults.length - i]}.png`)
        drawRotated(Math.random() * 360, toppingDraw)
    }
    //condiments
    for (var i = 1; i <= condiments; i++) {
        const condimentDraw = await Canvas.loadImage(`./images/foodgenerators/pizza/condiments/${condimentResults[condimentResults.length - i]}.png`)
        drawRotated(Math.random() * 360, condimentDraw)
    }

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'pizza-result.png');

    //////////////////
    // Last Touches //
    //////////////////

    if (toppingResults.length > 8) {
        embed = new Discord.MessageEmbed()
			.setColor('#F0B2ED')
			.setTitle(`Current Pizza Toppings:`)
            .setDescription(`${toppingList}`)
			.setFooter(`Pizza`);

        message.author.send({embeds: [embed]})
        toppingList = `*Too many toppings in this field.\nYou should get a DM with the topping list.*`
    }

    if (condimentResults.length > 8) {
        embed = new Discord.MessageEmbed()
			.setColor('#F0B2ED')
			.setTitle(`Current Pizza Condiments:`)
            .setDescription(`${condimentList}`)
			.setFooter(`Pizza`);

        message.author.send({embeds: [embed]})
        condimentList = `*Too many condiments in this field.\nYou should get a DM with the condiment list.*`
    }

    if (toppings < 1) {
        toppingList = `\nNone`
        toppingName = `${cheese}`
    }

    if (condiments < 1)
        condimentList = `\nNone`

    if (toppingName.length > 128)
        toppingName = "Title too long to process."

    embed = new Discord.MessageEmbed()
			.setColor('#FF6100')
			.setTitle(`${toppingName} ${toppingName == "Title too long to process." ? '' : 'Pizza'}`)
            .addFields(
                { name: 'Sauce', value: `${sauce}`, inline: true },
                { name: 'Cheese', value: `${cheese}`, inline: true },
                { name: 'Topping Number', value: `${toppings}`, inline: false },
                { name: 'Toppings', value: `${toppingList}`, inline: true },
                { name: 'Condiment Number', value: `${condiments}`, inline: false },
                { name: 'Condiments', value: `${condimentList}`, inline: true },
            )
            .setImage(`attachment://pizza-result.png`)
			.setFooter(`Pizza`);

    return message.channel.send({embeds: [embed], files: [attachment]})
}

// Export Functions
module.exports = {
	getPizza: function (toppings, repeatToppings, condiments, repeatCondiments, allowCheese, allowSauce, message) {
		return pizza(toppings, repeatToppings, condiments, repeatCondiments, allowCheese, allowSauce, message)
	},
}