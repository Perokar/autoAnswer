require('dotenv').config();
const fs = require('fs')
const pass = new RegExp(process.env.passwordAdmin)
let data = {
    weekend:"somthing",
    restTime:"somthingElse"
}
function admin(bot) {
    bot.onText(pass,(msg)=>{
        bot.sendMessage(msg.from.id, "Good you are admin.\n You have menu for change message")
    });
    bot.onText(/\/msgWorkDay/,(msg)=>{
        bot.sendMessage(msg.from.id, "Enter th message work day end prees SEND").then(data=>{
            if (data.message_id+1) console.log (data)
            })
        })
    }

module.exports = {admin}