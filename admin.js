require('dotenv').config();
const fs = require('fs')
const pass = new RegExp(process.env.passwordAdmin)
let data = {
    weekend:"somthing",
    restTime:"somthingElse"
}
function admin(bot,msg) {
    bot.sendMessage(msg.from.id, 'Enter admin password')
    try{
    bot.onText(pass,()=>{
    bot.sendMessage(msg.from.id, "Good you are admin.\n You have menu for change message")
        // bot.onText(/\/WorkMess/, (msg)=>{
        //     console.log(msg)
        // })
    })
}
catch(e) {console.log(`polling errris ${e}`)}
}
module.exports = {admin}