const TelegramBot = require('node-telegram-bot-api');
var moment = require('moment-timezone');
const nodeCron = require("node-cron");
require('dotenv').config();

const token = process.env.token;
const bot = new TelegramBot(token, { polling: true });
let chatId = [];

async function startApp() {
    let restTime = await moment.tz('America/Chicago').format('hh:mm A');
    let weekend = await moment.tz('America/Chicago').day();
    console.log("start bot " + restTime);
    const nowHours = new Date().getHours()
    const restMessage = {
        text: "As our hours of operation 8AM - 5PM central time we are no longer by computer, please leave your message and we will assist you tomorrow. "
    }
    const weekendMessage = {
        text: "Hello! Our hours of operation are Monday through Friday 8AM - 5PM central time. We address accidents questions over the weekend only."
    }

    function startBot() {
        return bot.on('message', async(msg) => {
            if (msg.text === '/start') {
                return false
            }
            let restTime = await moment.tz('America/Chicago').format('hh:mmA');
            let weekend = moment.tz('America/Chicago').day();
            if (msg.text === '/check') {
                bot.sendMessage(msg.from.id, `Time in Chicago now ${restTime} \n Day of week ${weekend} \n Id groups where bot sends message ${chatId} \n`)
            }
            if ((weekend === 6 || weekend === 0) && !chatId.includes(msg.chat.id)) {
                await chatId.push(msg.chat.id);
                return bot.sendMessage(msg.chat.id, weekendMessage.text)
            } else if (((restTime.includes("AM") && Number(restTime[0] + restTime[1]) < 8) || (restTime.includes("PM") && Number(restTime[0] + restTime[1]) >= 5)) && !chatId.includes(msg.chat.id)) {
                await chatId.push(msg.chat.id);
                return bot.sendMessage(msg.chat.id, restMessage.text)

            } else {
                return false
            }
        });
    }
    startBot()
}
startApp()
job = nodeCron.schedule('0 17 * * 1-5', () => { chatId = [] }, { timezone: 'America/Chicago' });