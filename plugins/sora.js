const axios = require('axios');

module.exports = {
    command: "sora",
    alias: ["aivideo", "videogen", "text2video", "genvideo"],
    desc: "Generate AI videos from text prompts",
    category: "ai",
    react: "🎥",
    filename: __filename,

    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;
            const text = args.join(" ").trim();

            if (!text) {
                return await sock.sendMessage(from, {
                    text: `*🎥 𝙰𝙸 𝚅𝙸𝙳𝙴𝙾 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙾𝚁 🎥*\n\n*𝙲𝚁𝙴𝙰𝚃𝙴 𝙰𝙸 𝚅𝙸𝙳𝙴𝙾𝚂 𝙵𝚁𝙾𝙼 𝚃𝙴𝚇𝚃 🎬*\n*𝚆𝚁𝙸𝚃𝙴 𝙻𝙸𝙺𝙴 𝚃𝙷𝙸𝚂 ☺️*\n\n*🎥 𝚂𝙾𝚁𝙰 ❮𝚈𝙾𝚄𝚁 𝚅𝙸𝙳𝙴𝙾 𝙿𝚁𝙾𝙼𝙿𝚃❯*\n\n*𝙴𝚇𝙰𝙼𝙿𝙻𝙴𝚂:*\n*• .sora a cat playing piano*\n*• .sora sunset over mountains*\n*• .sora futuristic city with flying cars*\n*• .sora underwater ocean scene*\n\n*𝚆𝚁𝙸𝚃𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ❮𝚂𝙾𝚁𝙰❯ 𝙰𝙽𝙳 𝚈𝙾𝚄𝚁 𝚅𝙸𝙳𝙴𝙾 𝙿𝚁𝙾𝙼𝙿𝚃 🎥*\n*𝙰𝙸 𝚆𝙸𝙻𝙻 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙴 𝙰 𝚅𝙸𝙳𝙴𝙾 𝙵𝙾𝚁 𝚈𝙾𝚄 ✨*`
                }, { quoted: msg });
            }

            await sock.sendMessage(from, {
                text: `*🎬 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙸𝙽𝙶 𝙰𝙸 𝚅𝙸𝙳𝙴𝙾...*\n\n*📝 𝙿𝚛𝚘𝚖𝚙𝚝: ${text}*\n*⏳ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝, 𝚝𝚑𝚒𝚜 𝚖𝚊𝚢 𝚝𝚊𝚔𝚎 𝚊 𝚏𝚎𝚠 𝚖𝚒𝚗𝚞𝚝𝚎𝚜...*`
            }, { quoted: msg });

            const apiUrl = `https://okatsu-rolezapiiz.vercel.app/ai/txt2video?text=${encodeURIComponent(text)}`;
            
            const response = await axios.get(apiUrl, { 
                responseType: 'arraybuffer',
                timeout: 120000 
            });

            const videoBuffer = Buffer.from(response.data, 'binary');

            await sock.sendMessage(from, {
                video: videoBuffer,
                caption: `*🎥 𝙰𝙸 𝚅𝙸𝙳𝙴𝙾 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙴𝙳 🎥*\n\n*📝 𝙿𝚛𝚘𝚖𝚙𝚝:* ${text}\n*🤖 𝙼𝚘𝚍𝚎𝚕:* SORA AI\n*✨ 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳*`
            }, { quoted: msg });

        } catch (error) {
            console.error('SORA Error:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `*❌ 𝚅𝙸𝙳𝙴𝙾 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙸𝙾𝙽 𝙵𝙰𝙸𝙻𝙴𝙳*\n\n*𝙴𝚛𝚛𝚘𝚛: ${error.message}*\n*𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚠𝚒𝚝𝚑 𝚊 𝚍𝚒𝚏𝚏𝚎𝚛𝚎𝚗𝚝 𝚙𝚛𝚘𝚖𝚙𝚝.*\n\n*✨ 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳*`
            }, { quoted: msg });
        }
    }
};
