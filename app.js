const Discord = require('discord.js')
const request = require('request')
const fs = require('fs')
const BigNumber = require('bignumber.js')
const config = require('./config.json')

const client = new Discord.Client({autoReconnect: true})
const prefix = config.prefix
const RPCuser = config.RPCuser
const RPCpass = config.RPCpass
const RPCUrl = config.RPCUrl
const trelloapi = config.trellokey
const coinName = config.coinName
const ticker = config.ticker
const website = config.website
const swiftex = config.swiftex
const altmarkets = config.altmarkets
const cratex = config.cratex
const channelid = config.channelid
const botowner = config.ownerid
const channelid2 = config.channelid2

var priceloop = setInterval(updateSwiftex, 480 * 1000);
var priceloop2 = setInterval(updateAltmarkets, 480 * 1000);
var priceloop3 = setInterval(updateCratex, 480 * 1000);
var last, buy, sell, open, low, high, vol, avgprice, price_change_percent, statusEmbed, altmlast, altmbuy, altmsell, altmhigh, altmlow, altmvol;
// ^^ this is such a cheap hax lul
// Fix this in the future  just pass the message onto the request and push it from there.

const clean = text => {
  if (typeof (text) === 'string') {
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
  } else {
    return text
  }
}

client.on('error', console.error);
//admin commands.
client.on('message', message => {
//      if (message.channel.id != channelid) return
        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const command = args.shift().toLowerCase()
        if(command == 'loop') {
	console.log('starting loop')
        var interval = setInterval (function () {
        var embed = new Discord.RichEmbed()
        .setTitle(coinName+" Australia Cash Prices")
        .setAuthor(coinName+" Team")
        .setColor('#00AE86')
        .setDescription(":chart_with_upwards_trend: Current " + ticker + " prices.")
        .setTimestamp()
        .setURL("https://swiftex.co/trading/genix-btc#")
        //.addField("Swiftex: ", "Buy: " + buy = parseFloat(buy).toFixed(9) + "\nSell " + sell = parseFloat(sell).toFixed(9), true)
        .addField("Swiftex: ", "Price: " + last + "\n" +
        "Buy: " + buy + "\n" +
        "Sell: " + sell + "\n" +
        "High: " + high + "\n" +
        "Low: " + low + "\n" +
        "Volume: " + vol + " " + ticker + "\n", true)
        .addField("Altmarkets: ", "Price: " + altmlast + "\n" +
        "Buy: " + altmbuy + "\n" +
        "Sell: " + altmsell + "\n" +
        "High: " + altmhigh + "\n" +
        "Low: " + altmlow + "\n" +
        "Volume: " + altmvol + " " + ticker + "\n", true)
        .addField("Cratex: ", "Price: " + last + "\n" +
        "Buy: " + buy + "\n" +
        "Sell: " + sell + "\n" +
        "High: " + high + "\n" +
        "Low: " + low + "\n" +
        "Volume: " + vol + " " + ticker + "\n", true)
      //  .addField("Volume BTC", volbtc = parseFloat(volbtc).toFixed(8), true)
        message.channel.send({embed})
        .then(message => {
          message.delete(1800*1000)
        })
      }, 1800 * 1000 );//1800 * 1000);
  }
})

client.on('ready', () => {
  console.log('########################################')
  console.log('#                                      #')
  console.log('#               '+ coinName + ' Discord Bot      #')
  console.log('#                V_' + config.botVersion + '               #')
  console.log('#                                      #')
  console.log('########################################')
  console.log('>Attempting to update vars for first launch.')
  console.log('>_ ')
    //update our vars on inital launch bc loop doesn't execute before starting timer.
    updateSwiftex()
    updateAltmarkets()
  client.user.setActivity('')
})

/**
client.on('guildMemberAdd', member => {
    member.send('hi');
});
**/

client.on('message', message => {
  if (message.author.id === client.user.id) return
  if (message.channel.recipient) return
  if (!message.content.startsWith(prefix)) return
  if (message.channel.id != channelid2) return
  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

/**
    if(command == 'time') {
        var embed = new Discord.RichEmbed()
        .setTitle(coinName+" Bot")
        .setAuthor(coinName+" Team")
        .setColor('#00AE86')
        .setDescription(":clock: Time for current core members.")
        .setTimestamp()
        .setURL(website)
        .addField(":question: 01000111", "unknown")
        .addField(":flag_au: Cors1er", aus)
        .addField(":flag_eu: Chinces", eu)
        .addField(":flag_eu: Chinces", eu)
        .addField(":flag_us: Twinky", useast, true)
        message.channel.send({embed})
    }
    if(command == 'chain') {
        updateChainData()
        const embed = new Discord.RichEmbed()
        .setTitle(coinName+" Discord Bot")
        .setAuthor(coinName+" Team")
        .setColor('#00AE86')
        .setDescription(":wrench: "+coinName+" chain information")
        .setTimestamp()
        .setURL(website)
        .addField("Block height:" , blocks, true)
        .addField("Wallet version:" , walVer, true)
        message.channel.send({embed})
    }
**/

    if(command == 'status') {
        checkNodeStatus(args, message);
    }

  })

client.login(config.token2)

function updateSwiftex() {
    request(swiftex, (error, response, body) => {
	if(error) {
            console.error('An error has occured: ', error);
            return;
        } else {
            if(response.ok) {
                console.log("response is bad mkay")
                return;
            }
            //swiftex response:
            //{"at":1557556481,"ticker":{"buy":"0.000000018","sell":"0.000000023","low":"0.000000018","high":"0.000000018","open":1.8e-08,"last":"0.000000018",
            //"volume":"486989.31214055","avg_price":"0.000000018","price_change_percent":"+0.00%","vol":"486989.31214055"}}
            try {
            const data = JSON.parse(body)
            buy = data["ticker"]["buy"]
            sell = data["ticker"]["sell"]
            low = data["ticker"]["low"]
            high = data["ticker"]["high"]
            open = data["ticker"]["open"]
            last = data["ticker"]["last"]
            vol = data["ticker"]["volume"]
            vol = parseFloat(vol).toFixed(0);
            avgprice = data["ticker"]["avg_price"]
            price_change_percent = data["ticker"]["price_change_percent"]
            client.user.setActivity('Last price: ' + parseFloat(last).toFixed(8))
            console.log(last.toString());
            } catch (error) {
                console.error(error);
            }
        }
    });
}

function updateAltmarkets() {
    request(altmarkets, (error, response, body) => {
	if(error) {
            console.error('An error has occured: ', error);
            return;
        } else {
            if(response.ok) {
                console.log("response is bad mkay")
                return;
            }
            //swiftex response:
            //{"at":1557556481,"ticker":{"buy":"0.000000018","sell":"0.000000023","low":"0.000000018","high":"0.000000018","open":1.8e-08,"last":"0.000000018",
            //"volume":"486989.31214055","avg_price":"0.000000018","price_change_percent":"+0.00%","vol":"486989.31214055"}}
            try {
            const data2 = JSON.parse(body)
            altmbuy = data2["ticker"]["buy"]
            altmsell = data2["ticker"]["sell"]
            altmlow = data2["ticker"]["low"]
            altmhigh = data2["ticker"]["high"]
            altmlast = data2["ticker"]["last"]
            altmvol = data2["ticker"]["vol"]
            altmvol = parseFloat(altmvol).toFixed(0);
            console.log(altmlast.toString());
            } catch (error) {
                console.error(error);
            }
        }
    });
}

//connect to jRPC and parse data.
function updateChainData() {
    let options = {
    url: RPCUrl,
    method: "post",
    headers:
    {
     "content-type": "text/plain"
    },
    auth: {
        user: RPCuser,
        pass: RPCpass
    },
    body: JSON.stringify( {"jsonrpc": "1.0", "id": "curltest", "method": "getinfo" })
};

request(options, (error, response, body) => {
    if (error) {
        console.error('An error has occurred: ', error);
        return
    } else {
        const data = JSON.parse(body)
        blocks = data["result"]["blocks"];
        walVer = data["result"]["walletversion"];
        console.log('fetching data');
    }
    });
}
//Checking masternode status (requires input of masternode address )
function checkNodeStatus(lookup, message) {
    console.log(lookup)
    let options = {
    url: RPCUrl,
    method: "post",
    headers:
    {
     "content-type": "text/plain"
    },
    auth: {
        user: RPCuser,
        pass: RPCpass
    },
    body: JSON.stringify( {"jsonrpc": "2.0", "id": "MN_STATUS", "method": "masternodelist", "params": ["full", "" + lookup] })
};

request(options, (error, response, body) => {
    if (error) {
        console.error('An error has occurred: ', error);
        return
    } else {
        const data = JSON.parse(body)
        message.channel.send(body)
        }
    });
}


//Checks if the json data is valid before parsing to prevent errors.
function JSONCheck(data) {
    try {
        JSON.parse(data);
        return true;
    } catch (error) {
        console.error(error)
        return false;
    }
}
