require('dotenv').config();
const fs = require('fs')
const pass = process.env.passwordAdmin
const checkPass = new RegExp(pass)
const wrongPass = new RegExp (`^(?!.*${pass}*).+$`);
console.log(wrongPass)
let data = {
    weekend: "somthing",
    restTime: "somthingElse"
}

function admin(bot, mode) {
        bot.onText(checkPass, (msg) => {
            bot.sendMessage(msg.from.id, "Good you are admin.\n You have menu for change message\n ", require('./menu')).then((data) => {listenBtn(bot, mode, data.message_id)})
            bot.removeTextListener(checkPass)
            bot.removeTextListener(wrongPass)
        })
        bot.onText(wrongPass,(msg)=>{
            bot.sendMessage(msg.from.id, 'Password is wrong')
            bot.removeTextListener(wrongPass)
            bot.removeTextListener(checkPass)
        })
}

function listenBtn(bot, mode, id) {
        console.log('start listener');
    bot.on("callback_query", (msg) => {
        adminMenu(bot,msg,id);
    })  
}
const adminMenu = async (bot, callback, id)=>{
    switch (callback.data) {
        case ("ChangeRDM"):
            bot.sendMessage(callback.from.id, "Enter th message work day end prees SEND")
            bot.onText(/[\W|\w|\d]/, async(msg) => {
                    let text = await msg.text;
                    bot.removeTextListener(/[\W|\w|\d]/);
                    return new Promise((res) => { fileData(text, false) })
                        .then(bot.sendMessage(msg.from.id, "Thank you. Your message is save"))
                })
            break;
        case ("ChangeWDM"):
            bot.sendMessage(callback.from.id, "Enter th message weekend end prees SEND")
            bot.onText(/[\W|\w|\d]/, async(msg) => {
                let text = await msg.text;
                bot.removeTextListener(/[\W|\w|\d]/);
                return new Promise((res) => { fileData(false, text) })
                    .then(bot.sendMessage(msg.from.id, "Thank you. Your message is save"))
            })
            break;
        case ("exit"):
            bot.sendMessage(callback.from.id, "Thank you. Admin mode is off")
            let chatId = await callback.message.chat.id;
            let msgId = await id;
            bot.deleteMessage(chatId, msgId)
            exit();
    }
}

const fileData = async(rest, weekend) => {
    const fileJson = fs.readFileSync('data.json')
    const dataFile = JSON.parse(fileJson)
    if (weekend === false && rest.length > 0) {
        dataFile.restTime = await rest;
        try {
            fs.writeFileSync('data.json', JSON.stringify(dataFile))
        } catch (err) {
            console.log(err)
        }
    }
    if (rest === false && weekend.length > 0) {
        dataFile.weekend = await weekend;
        try {
            fs.writeFileSync('data.json', JSON.stringify(dataFile))
        } catch (err) {
            console.log(err)
        }
    }
    return false
}
function exit (){
    return false;
}

module.exports = {
    admin, exit
}