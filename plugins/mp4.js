const axios = require('axios');

module.exports = {
    command: "mp4",
    alias: ["video", "ytvideo", "youtube", "download", "vid"],
    desc: "Download YouTube videos as MP4",
    category: "download",
    react: "🎬",
    filename: __filename,

    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;
            const text = args.join(" ").trim();

            if (!text) {
                return await sock.sendMessage(from, {
                    text: `*🎬 𝚈𝙾𝚄𝚃𝚄𝙱𝙴 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 🎬*\n\n*𝙳𝙾 𝚈𝙾𝚄 𝚆𝙰𝙽𝚃 𝚃𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙰 𝚈𝙾𝚄𝚃𝚄𝙱𝙴 𝚅𝙸𝙳𝙴𝙾? 🥺*\n*𝚃𝙷𝙴𝙽 𝚆𝚁𝙸𝚃𝙴 𝙻𝙸𝙺𝙴 𝚃𝙷𝙸𝚂 ☺️*\n\n*🎬 𝙼𝙿𝟺 ❮𝚈𝙾𝚄𝚃𝚄𝙱𝙴 𝚅𝙸𝙳𝙴𝙾 𝙻𝙸𝙽𝙺 𝙾𝚁 𝙽𝙰𝙼𝙴❯*\n\n*𝙴𝚇𝙰𝙼𝙿𝙻𝙴𝚂:*\n*• .mp4 https://youtube.com/watch?v=xxx*\n*• .mp4 funny cat videos*\n*• .mp4 music video ed sheeran*\n*• .mp4 tutorial how to cook*\n\n*𝚆𝚁𝙸𝚃𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ❮𝙼𝙿𝟺❯ 𝙰𝙽𝙳 𝚅𝙸𝙳𝙴𝙾 𝙻𝙸𝙽𝙺/𝙽𝙰𝙼𝙴 ☺️*\n*𝚃𝙷𝙴𝙽 𝚈𝙾𝚄 𝚆𝙸𝙻𝙻 𝙶𝙴𝚃 𝚃𝙷𝙴 𝙼𝙿𝟺 𝚅𝙸𝙳𝙴𝙾 𝙵𝙸𝙻𝙴 🎥✨*`
                }, { quoted: msg });
            }

            // Check if it's a YouTube URL or search query
            const isYouTubeUrl = text.match(/(youtube\.com|youtu\.be)/i);
            let videoUrl = text;

            if (!isYouTubeUrl) {
                // It's a search query, we need to search first
                await sock.sendMessage(from, {
                    text: `*🔍 𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶 𝚈𝙾𝚄𝚃𝚄𝙱𝙴...*\n\n*📝 𝚀𝚞𝚎𝚛𝚢: ${text}*\n*⏳ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝, 𝚜𝚎𝚊𝚛𝚌𝚑𝚒𝚗𝚐 𝚏𝚘𝚛 𝚟𝚒𝚍𝚎𝚘𝚜...*`
                }, { quoted: msg });

                const searchUrl = `https://okatsu-rolezapiiz.vercel.app/search/play?query=${encodeURIComponent(text)}`;
                const searchResponse = await axios.get(searchUrl, { timeout: 30000 });
                
                if (!searchResponse.data?.result?.[0]?.url) {
                    throw new Error('No videos found for your search');
                }

                videoUrl = searchResponse.data.result[0].url;
            }

            // Send processing message
            await sock.sendMessage(from, {
                text: `*📥 𝙿𝚁𝙾𝙲𝙴𝚂𝚂𝙸𝙽𝙶 𝚅𝙸𝙳𝙴𝙾...*\n\n*🔗 𝚅𝚒𝚍𝚎𝚘: ${videoUrl}*\n*⏳ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝, 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚒𝚗𝚐 𝚟𝚒𝚍𝚎𝚘...*`
            }, { quoted: msg });

            // API URL for YouTube MP4 download
            const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(videoUrl)}`;
            
            console.log(`🎬 Downloading YouTube video: ${videoUrl}`);

            // Make API request
            const response = await axios.get(apiUrl, {
                timeout: 120000 // 2 minutes timeout for video download
            });

            const data = response.data;

            if (!data || data.error) {
                throw new Error(data?.error || 'No video data found');
            }

            // Check if we have video data
            if (!data.result || !data.result.video) {
                throw new Error('No video download link available');
            }

            const video = data.result;

            // Send video info first
            const videoInfo = `*🎬 𝚅𝙸𝙳𝙴𝙾 𝙵𝙾𝚄𝙽𝙳 🎬*\n\n` +
                           `*📛 𝚃𝚒𝚝𝚕𝚎:* ${video.title || 'Unknown'}\n` +
                           `*⏱️ 𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗:* ${video.duration || 'Unknown'}\n` +
                           `*📊 𝚀𝚞𝚊𝚕𝚒𝚝𝚢:* ${video.quality || 'High'}\n` +
                           `*📦 𝚂𝚒𝚣𝚎:* ${video.filesize || 'Unknown'}\n\n` +
                           `*⬇️ 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙸𝙽𝙶 𝙼𝙿𝟺...*`;

            await sock.sendMessage(from, {
                text: videoInfo
            }, { quoted: msg });

            // Download the video
            const videoResponse = await axios.get(video.video, {
                responseType: 'arraybuffer',
                timeout: 120000 // 2 minutes for video download
            });

            const videoBuffer = Buffer.from(videoResponse.data, 'binary');

            // Check file size (WhatsApp limit is ~16MB for videos)
            const fileSizeMB = videoBuffer.length / (1024 * 1024);
            if (fileSizeMB > 16) {
                throw new Error(`Video file too large (${fileSizeMB.toFixed(1)}MB). WhatsApp limit is 16MB.`);
            }

            // Send the video file
            await sock.sendMessage(from, {
                video: videoBuffer,
                mimetype: 'video/mp4',
                fileName: `${(video.title || 'video').replace(/[^\w\s]/gi, '')}.mp4`,
                caption: `*🎬 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝙳 🎬*\n\n` +
                        `*📛 𝚃𝚒𝚝𝚕𝚎:* ${video.title || 'Unknown'}\n` +
                        `*⏱️ 𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗:* ${video.duration || 'Unknown'}\n` +
                        `*📊 𝚀𝚞𝚊𝚕𝚒𝚝𝚢:* ${video.quality || 'High'}\n` +
                        `*📦 𝚂𝚒𝚣𝚎:* ${(fileSizeMB).toFixed(1)}MB\n\n` +
                        `*🎥 𝙴𝚗𝚓𝚘𝚢 𝚢𝚘𝚞𝚛 𝚟𝚒𝚍𝚎𝚘!*\n` +
                        `*✨ 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳*`
            }, { quoted: msg });

            console.log(`✅ Video downloaded successfully: ${video.title}`);

        } catch (error) {
            console.error('❌ YouTube Video Download Error:', error);
            
            let errorMessage = '*❌ 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙵𝙰𝙸𝙻𝙴𝙳*\n\n';
            
            if (error.response?.status === 404) {
                errorMessage += '*🚫 𝚅𝙸𝙳𝙴𝙾 𝙽𝙾𝚃 𝙵𝙾𝚄𝙽𝙳*\n*📛 𝙽𝚘 𝚟𝚒𝚍𝚎𝚘 𝚏𝚘𝚞𝚗𝚍 𝚏𝚘𝚛 𝚢𝚘𝚞𝚛 𝚜𝚎𝚊𝚛𝚌𝚑 𝚘𝚛 𝚕𝚒𝚗𝚔.*';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage += '*⏰ 𝚁𝙴𝚀𝚄𝙴𝚂𝚃 𝚃𝙸𝙼𝙴𝙳 𝙾𝚄𝚃*\n*📛 𝚅𝚒𝚍𝚎𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚝𝚘𝚘𝚔 𝚝𝚘𝚘 𝚕𝚘𝚗𝚐. 𝚃𝚛𝚢 𝚊 𝚜𝚑𝚘𝚛𝚝𝚎𝚛 𝚟𝚒𝚍𝚎𝚘.*';
            } else if (error.response?.status === 429) {
                errorMessage += '*📛 𝙰𝙿𝙸 𝙻𝙸𝙼𝙸𝚃 𝙴𝚇𝙲𝙴𝙴𝙳𝙴𝙳*\n*🚫 𝚃𝚘𝚘 𝚖𝚊𝚗𝚢 𝚛𝚎𝚚𝚞𝚎𝚜𝚝𝚜. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.*';
            } else if (error.message.includes('file too large')) {
                errorMessage += '*📦 𝙵𝙸𝙻𝙴 𝚃𝙾𝙾 𝙻𝙰𝚁𝙶𝙴*\n*🚫 𝚅𝚒𝚍𝚎𝚘 𝚒𝚜 𝚝𝚘𝚘 𝚋𝚒𝚐 𝚏𝚘𝚛 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 (𝚖𝚊𝚡 𝟷𝟼𝙼𝙱). 𝚃𝚛𝚢 𝚊 𝚜𝚑𝚘𝚛𝚝𝚎𝚛 𝚟𝚒𝚍𝚎𝚘.*';
            } else if (error.message.includes('No video download link')) {
                errorMessage += '*🔗 𝙽𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙻𝙸𝙽𝙺*\n*📛 𝚅𝚒𝚍𝚎𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚕𝚒𝚗𝚔 𝚗𝚘𝚝 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚏𝚘𝚛 𝚝𝚑𝚒𝚜 𝚟𝚒𝚍𝚎𝚘.*';
            } else {
                errorMessage += '*🔧 𝚂𝙴𝚁𝚅𝙴𝚁 𝙴𝚁𝚁𝙾𝚁*\n*📛 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛 𝚘𝚛 𝚞𝚜𝚎 𝚊 𝚍𝚒𝚏𝚏𝚎𝚛𝚎𝚗𝚝 𝚟𝚒𝚍𝚎𝚘.*';
            }

            errorMessage += '\n\n*💡 𝚃𝙸𝙿𝚂 𝙵𝙾𝚁 𝙱𝙴𝚃𝚃𝙴𝚁 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝚂:*\n';
            errorMessage += '• 𝚄𝚜𝚎 𝚜𝚑𝚘𝚛𝚝 𝚟𝚒𝚍𝚎𝚘𝚜 (𝚞𝚗𝚍𝚎𝚛 𝟻 𝚖𝚒𝚗𝚞𝚝𝚎𝚜)\n';
            errorMessage += '• 𝙲𝚘𝚙𝚢 𝚍𝚒𝚛𝚎𝚌𝚝 𝚈𝚘𝚞𝚃𝚞𝚋𝚎 𝚕𝚒𝚗𝚔𝚜\n';
            errorMessage += '• 𝙰𝚟𝚘𝚒𝚍 𝚕𝚘𝚗𝚐 𝚟𝚒𝚍𝚎𝚘𝚜 𝚝𝚘 𝚙𝚛𝚎𝚟𝚎𝚗𝚝 𝚕𝚊𝚛𝚐𝚎 𝚏𝚒𝚕𝚎𝚜\n';
            errorMessage += '• 𝚄𝚜𝚎 𝚌𝚕𝚎𝚊𝚛 𝚜𝚎𝚊𝚛𝚌𝚑 𝚚𝚞𝚎𝚛𝚒𝚎𝚜\n\n';
            errorMessage += '*🎬 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳*';

            await sock.sendMessage(msg.key.remoteJid, {
                text: errorMessage
            }, { quoted: msg });
        }
    }
};
