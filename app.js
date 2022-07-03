const TelegramBot = require('node-telegram-bot-api');
var moment = require('moment-timezone');
const nodeCron = require("node-cron");
const fs = require('fs');
require('dotenv').config();
const token = process.env.token;
const bot = new TelegramBot(token, {
    polling: true
});
let chatId = [];
let dataMessage = () => {
    let fileJson = fs.readFileSync('data.json')
    return JSON.parse(fileJson);
}

async function startApp() {
    let restTime = await moment.tz('America/Chicago').format('hh:mm A');
    let weekend = await moment.tz('America/Chicago').day();
    console.log("start bot " + restTime);

    function startBot() {
            bot.on('message', async (msg) => {
                let restTime = await moment.tz('America/Chicago').format('hh:mm A');
                let weekend = await moment.tz('America/Chicago').day();
                let restT = +(restTime[0]+restTime[1]);
                switch (msg.text) {
                    case '/start':
                        break;
                    case '/check':
                        await bot.sendMessage(msg.from.id, `Time in Chicago now ${restTime} \n Day of week ${weekend} \n Id groups where bot sends message ${chatId} \n Text message ====${dataMessage().weekend}`)
                        break;
                    default:
                        if (weekend === 5 && (restTime.includes("PM") && restT>= 5) && !chatId.includes(await msg.chat.id)) {
                            chatId.push(await msg.chat.id);
                            bot.sendMessage(msg.chat.id, dataMessage().weekend);
                        } 
                        if ((weekend === 6 || weekend === 0) && !chatId.includes(await msg.chat.id)) {
                            chatId.push(await msg.chat.id);
                            bot.sendMessage(msg.chat.id, dataMessage().weekend)
                        }
                       if (((restTime.includes("AM") && ((restT < 8)||(restT===12))) || (restTime.includes("PM") && (restT >= 5)&& (restT!=12))) && !chatId.includes(await msg.chat.id)) {
                            chatId.push(await msg.chat.id);
                            bot.sendMessage(msg.chat.id, dataMessage().weekend)
                        }
                }
            });
    }
    startBot()
}
startApp()
job = nodeCron.schedule('0 17 * * 1-5', () => {
    chatId = [];
}, {
    timezone: 'America/Chicago'
});
jobWeekend = nodeCron.schedule('0 0 * * 6,0', () => {
    chatId = [];
}, {
    timezone: 'America/Chicago'
});