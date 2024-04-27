const axios = require("axios");
const moment = require("moment-timezone");
const fs = require("fs");

const linkapi = "https://api-7izq.onrender.com/downthread";

module.exports = {
    config: {
        name: "thread",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "tnt",
        description: "Down video and image",
        commandCategory: "Tiện ích",
        usages: "",
        cooldowns: 5
    },
    
    run: ({ api, event, args }) => {},    
    handleEvent: async ({ api, event }) => {
        const { body, threadID, messageID } = event;
        const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");
        
        if (!body || (!body.includes('https://www.threads.net/') && !body.includes('https://www.threads.net/'))) return;

        try {
            const { image_urls, video_urls, title } = (await axios.get(`${linkapi}?link=${body}`)).data; 

            if (image_urls.length > 0) {
                const imageAttachments = [];
                for (const imageUrl of image_urls) {
                    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
                    const imageData = Buffer.from(response.data, 'binary');
                    const fileName = `${title}_${moment().format("YYYYMMDDHHmmss")}.jpg`;
                    const filePath = `./${fileName}`;
                    fs.writeFileSync(filePath, imageData);
                    imageAttachments.push(fs.createReadStream(filePath));
                    fs.unlinkSync(filePath);
                }
                api.sendMessage({
                    body: `Số ảnh: ${image_urls.length}`,
                    attachment: imageAttachments
                }, threadID, messageID);
            }

            if (video_urls.length > 0) {
                for (const videoUrl of video_urls) {
                    const response = await axios.get(videoUrl, { responseType: "arraybuffer" });
                    const videoData = Buffer.from(response.data, 'binary');
                    const fileName = `${title}_${moment().format("YYYYMMDDHHmmss")}.mp4`;
                    const filePath = `./${fileName}`;
                    fs.writeFileSync(filePath, videoData);
                    api.sendMessage({
                        body: `Down video Thread: ${fileName}`,
                        attachment: fs.createReadStream(filePath)
                    }, threadID, messageID);
                    fs.unlinkSync(filePath);
                }
            }
            
        } catch (error) {
            console.error(error);
        }
    }
};
