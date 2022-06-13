const TelegramBot = require('node-telegram-bot-api');
var moment = require('moment-timezone');
var schedule = require('node-schedule-tz');
require('dotenv').config();

const token = process.env.token;
const bot = new TelegramBot(token, { polling: true });


function startApp() {
    const nowHours = new Date().getHours()
    const restTime = moment.tz('America/Chicago').format('H:MMA');
    const weekend = moment.tz('America/Chicago').day()
    console.log(`startApp StartJob time: ${restTime}`)
    const restMessage = {
        status: 0,
        text: "As our hours of operation 8AM - 5PM central time we are no longer by computer, please leave your message and we will assist you tomorrow. "
    }
    const weekendMessage = {
        status: 0,
        text: "Hello! Our hours of operation are Monday through Friday 8AM - 5PM central time. We address accidents questions over the weekend only."
    }

    function startBot() {
        return bot.on('message', (msg) => {
            console.log(msg)
            if (msg.text === '/check') {
                bot.sendMessage(msg.from.id, `Time in Chicago now ${restTime} \n Day of week ${weekend} \n Status restMessage ${restMessage.status} \n Status Weekend ${weekendMessage.status}`)
            }
            if ((weekend === 6 || weekend === 0) && weekendMessage.status == 0) {
                weekendMessage.status = restMessage.status = 1;
                return bot.sendMessage(msg.chat.id, weekendMessage.text)
            } else if (((restTime.includes("AM") && Number(restTime[0]) < 8) || (restTime.includes("PM" && Number(restTime[0]) > 17))) && restMessage.status === 0) {
                console.log(restTime)
                restMessage.status = true;
                return bot.sendMessage(msg.chat.id, restMessage.text)

            } else {
                return false
            }
        });
    }
    startBot()
}
let restart = schedule.scheduleJob('0 17 * * 0-5', 'America/Chicago', startApp());