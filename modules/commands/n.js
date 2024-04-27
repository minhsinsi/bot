const ytdl = require('ytdl-core');
const fs = require('fs-extra');
const axios = require('axios');

module.exports = {
    config: {
        name: "\n",
        version: "1.0.0",
        hasPermssion: 0,
        credits: "tnt",
        description: "",
        commandCategory: "Tiện ích",
        usages: "",
        cooldowns: 5
    },

    run: async ({ api, event, args }) => {
        const downloadMusicFromYoutube = async (link, path) => {
            if (!link) throw new Error('Thiếu link');

            const timestart = Date.now();

            return new Promise(async (resolve, reject) => {
                try {
                    const videoStream = ytdl(link, { filter: format => format.quality === 'tiny' && format.audioBitrate === 48 && format.hasAudio === true });
                    const writeStream = fs.createWriteStream(path);
                    
                    videoStream.on('error', reject);
                    writeStream.on('error', reject);
                    
                    videoStream.pipe(writeStream);

                    writeStream.on('finish', async () => {
                        const videoInfo = await ytdl.getInfo(link);
                        const durationInSeconds = parseInt(videoInfo.videoDetails.lengthSeconds);
                        const result = {
                            title: videoInfo.videoDetails.title,
                            duration: durationInSeconds,
                            viewCount: videoInfo.videoDetails.viewCount,
                            likes: videoInfo.videoDetails.likes,
                            uploadDate: videoInfo.videoDetails.uploadDate,
                            author: videoInfo.videoDetails.author.name,
                            subscriberCount: videoInfo.videoDetails.author.subscriber_count,
                            timestart: timestart
                        };
                        resolve(result);
                    });
                } catch (error) {
                    reject(`Lỗi khi tải xuống video từ YouTube: ${error}`);
                }
            });
        };
     const moment = require("moment-timezone"); 
    var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");
        const convertSecondsToHMS = (seconds) => {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        };
  const dateNow = Date.now();
    const time = process.uptime(),
	      	hourss = Math.floor(time / (60 * 60)),
		      minutess = Math.floor((time % (60 * 60)) / 60),
		      secondss = Math.floor(time % 60);
        try {
            const { data } = await axios.get('https://api-7izq.onrender.com/link/linkytb');
            const youtubeLink = data.url; 

            if (!youtubeLink) return api.sendMessage("Thiếu liên kết Youtube", event.threadID);

            const musicPath = __dirname + "/cache/music.mp3"; 

            const musicData = await downloadMusicFromYoutube(youtubeLink, musicPath);

            const message = `\n┏━━━━━━━━━━━━━━━━━━━━┓\n┣➤❌ Lệnh không khả dụng\n┣➤🟢 Time hoạt động: ${hourss} : ${minutess} : ${secondss}\n┣➤⏰ Time: ${gio}\n┗━━━━━━━━━━━━━━━━━━━━┛\n`;

            api.sendMessage({
                body: message,
                attachment: fs.createReadStream(musicPath)
            }, event.threadID, () => fs.unlinkSync(musicPath));
        } catch (error) {
            api.sendMessage(`Đã xảy ra lỗi: ${error.message}`, event.threadID);
        }
    }
};
