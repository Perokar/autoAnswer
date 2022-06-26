module.exports = {
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
