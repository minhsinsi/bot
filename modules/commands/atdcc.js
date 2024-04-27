const axios = require("axios");
const moment = require("moment-timezone");

const linkapi = "https://api-7izq.onrender.com/capcut";

module.exports = {
    config: {
        name: "capcut",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "tnt",
        description: "Down CapCut",
        commandCategory: "Tiện ích",
        usages: "",
        cooldowns: 5
    },
    
    run: ({ api, event, args }) => {},    
    handleEvent: async ({ api, event }) => {
        const { body, senderID } = event;
        const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");
        
        if (!body || (!body.includes('https://www.capcut.com/template-detail/') && !body.includes('https://www.capcut.com/t/')) || senderID === api.getCurrentUserID() || senderID === '') return;

        try {
            const { title, description, usage, video } = (await axios.get(`${linkapi}?url=${body}`)).data;
            const stream = (await axios.get(video, { responseType: "stream" })).data;

            api.sendMessage({
                body: `┏━━━━━━━━━━━━━━━━━━━━┓
┣➤📝 𝗧𝗶𝗲̂𝘂 đ𝗲̂̀: ${title} 
┣➤🗒 𝗠𝗼̂ 𝘁𝗮̉: ${description}
┣➤📸 𝗟𝘂̛𝗼̛̣t 𝗱𝘂̀𝗻𝗴: ${usage}
┣➤⏰ 𝗧𝗶𝗺𝗲: ${gio}
┣➤🌸 𝗧𝘂̛̣ đ𝗼̣̂𝗻𝗴 𝘁𝗮̉𝗶 𝘃𝗶𝗱𝗲𝗼 𝘁𝘂̛̀ 𝗖𝗮𝗽𝗖𝘂𝘁
┗━━━━━━━━━━━━━━━━━━━━┛`,
                attachment: stream
            }, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
        }
    }
};
