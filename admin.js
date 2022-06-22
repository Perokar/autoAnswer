require('dotenv').config();
const fs = require('fs')
const pass = new RegExp(process.env.passwordAdmin)
let data = {
    weekend: "somthing",
    restTime: "somthingElse"
}
const keyboard = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: "Change work day message text ",
                callback_data: "ChangeRDM"
            }],
            [{
                text: "Change weekend message text",
                callback_data: "ChangeWDM"
            }],
            [{
                text: "Exit admin mode",
                callback_data: "exit"
            }]
        ]
    }
}
let count = 0;

function admin(bot, mode) {
    while (count > 0) {
        bot.removeTextListener(pass)
        count--
    }
    bot.onText(pass, (msg) => {
        bot.sendMessage(msg.from.id, "Good you are admin.\n You have menu for change message\n ", keyboard).then((data) => listenBtn(bot, mode, data.message_id))

        bot.removeTextListener(pass)
    })
    count++;
}

function listenBtn(bot, mode, id) {
    mode = true;
    bot.on("callback_query", async(msg) => {
        switch (msg.data) {
            case ("ChangeRDM"):
                bot.sendMessage(msg.from.id, "Enter th message work day end prees SEND")
                bot.onText(/[\W|\w|\d]/, async(msg) => {
                        let text = await msg.text;
                        bot.removeTextListener(/[\W|\w|\d]/);
                        return new Promise((res) => { fileData(text, false) })
                            .then(bot.sendMessage(msg.from.id, "Thank you. Your message is save"))
                    })
                    // bot.sendMessage(msg.from.id, "Thank you. Your message is save")
                break;
            case ("ChangeWDM"):
                bot.sendMessage(msg.from.id, "Enter th message weekend end prees SEND")
                bot.onText(/[\W|\w|\d]/, async(msg) => {
                    let text = await msg.text;
                    bot.removeTextListener(/[\W|\w|\d]/);
                    return new Promise((res) => { fileData(false, text) })
                        .then(bot.sendMessage(msg.from.id, "Thank you. Your message is save"))
                })
                break;
            case ("exit"):
                bot.sendMessage(msg.from.id, "Thank you. Admin mode is off")
                mode = false;
                let chatId = await msg.message.chat.id;
                let msgId = await id;
                bot.deleteMessage(chatId, msgId)

        }
    })
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
    return true
}


module.exports = {
    admin,
    listenBtn
}