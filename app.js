const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()
const token = process.env.token;
const bot = new TelegramBot(token, { polling: true });
var moment = require('moment-timezone');
const nowHours = new Date().getHours()
const restTime = moment.tz('America/Chicago').format('H:MMA');
const weekend = moment.tz('America/Chicago').day()

function startApp() {
    console.log("startApp")
    const restMessage = {
        status: 0,
        text: "As our hours of operation 8AM - 5PM central time we are no longer by computer, please leave your message and we will assist you tomorrow. "
    }

    function startBot() {
        return bot.on('message', (msg) => {
            if (((restTime.includes("AM") && Number(restTime[0]) < 8) || (restTime.includes("PM" && Number(restTime[0]) > 17))) && restMessage.status === 0) {
                bot.sendMessage(msg.chat.id, restMessage.text)
                restMessage.status = true;
            } else {
                return false
            }
        });
    }
    return startBot()
}


startApp()
    //  if ((restTime.includes("AM") && Number(restTime[0]) < 8) || (restTime.includes("PM" && Number(restTime[0]) > 17))) {

//     console.log("Time write " + restTime)
// } else {
//     console.log("time wrong " + restTime)
// }