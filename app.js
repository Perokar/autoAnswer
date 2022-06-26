const TelegramBot = require('node-telegram-bot-api');
var moment = require('moment-timezone');
const nodeCron = require("node-cron");
const fs = require('fs')
const {
    admin, exit
} = require('./admin');
require('dotenv').config();
const token = process.env.token;
const bot = new TelegramBot(token, {
    polling: true
});
let chatId = [];
let dataMessage = (() => {
    try {
        let js = fs.readFileSync('data.json');
        return JSON.parse(js);
    } catch (err) {
        concole.log(err)
    }
})
async function startApp() {
    let restTime = await moment.tz('America/Chicago').format('hh:mm A');
    let weekend = await moment.tz('America/Chicago').day();
    console.log("start bot " + restTime);
    const nowHours = new Date().getHours()
    let adminFlag = exit();
    bot.setMyCommands([{
        command: 'admin',
        description: "admin panel to control bot"
    }])

    function startBot() {
        try {
            bot.on('message', async (msg) => {
                let restTime = await moment.tz('America/Chicago').format('hh:mmA');
                let weekend = moment.tz('America/Chicago').day();
                switch (msg.text) {
                    case '/admin':
                        if (adminFlag === true){
                            bot.sendMessage (msg.from.id, "You already status admin")
                        }
                        if (adminFlag== false){
                            let check =await bot.sendMessage(msg.from.id, 'Enter admin password');
                            admin(bot, adminFlag)
                         }

                        break;
                    case '/start':
                        return false
                        break;
                    case '/check':
                        await bot.sendMessage(msg.from.id, `Time in Chicago now ${restTime} \n Day of week ${weekend} \n Id groups where bot sends message ${chatId}
                         \n Work day Message ${dataMessage().restTime} \n Weekend message ${dataMessage().weekend}`)
                        break;
                    default:
                        if (adminFlag == false) {
                            if (weekend === 5 && (restTime.includes("PM") && Number(restTime[0] + restTime[1]) >= 5) && !chatId.includes(msg.chat.id)) {
                                await chatId.push(msg.chat.id);
                                return bot.sendMessage(msg.chat.id, weekendMessage.text);
                            }
                            if ((weekend === 6 || weekend === 0) && !chatId.includes(msg.chat.id)) {
                                await chatId.push(msg.chat.id);
                                return bot.sendMessage(msg.chat.id, dataMessage().weekend)
                            } else if (((restTime.includes("AM") && Number(restTime[0] + restTime[1]) < 8) || (restTime.includes("PM") && Number(restTime[0] + restTime[1]) >= 5)) && !chatId.includes(msg.chat.id)) {
                                await chatId.push(msg.chat.id);
                                return bot.sendMessage(msg.chat.id, dataMessage().restTime)
                            }
                        }
                }
            });
        } catch (err) {
            console.log('error app ' + err)
        }
    }
    startBot()
}
startApp()
job = nodeCron.schedule('0 17 * * 1-5', () => {
    chatId = []
}, {
    timezone: 'America/Chicago'
});
jobWeekend = nodeCron.schedule('0 0 * * 6,0', () => {
    chatId = []
}, {
    timezone: 'America/Chicago'
});