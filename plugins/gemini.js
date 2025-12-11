const axios = require('axios');

module.exports = {
    command: "gemini",
    alias: ["googleai", "bard", "googlegemini"],
    desc: "Chat with Google Gemini AI",
    category: "ai",
    react: "🔮",
    filename: __filename,

    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;
            const text = args.join(" ").trim();

            if (!text) {
                return await sock.sendMessage(from, {
                    text: `*🔮 𝙶𝙾𝙾𝙶𝙻𝙴 𝙶𝙴𝙼𝙸𝙽𝙸 𝙰𝙸 🔮*\n\n*𝙰𝚂𝙺 𝙰𝙽𝚈𝚃𝙷𝙸𝙽𝙶 𝚃𝙾 𝙶𝙾𝙾𝙶𝙻𝙴'𝚂 𝙶𝙴𝙼𝙸𝙽𝙸 𝙰𝙸 🧠*\n*𝚆𝚁𝙸𝚃𝙴 𝙻𝙸𝙺𝙴 𝚃𝙷𝙸𝚂 ☺️*\n\n*🔮 𝙶𝙴𝙼𝙸𝙽𝙸 ❮𝚈𝙾𝚄𝚁 𝚀𝚄𝙴𝚂𝚃𝙸𝙾𝙽❯*\n\n*𝙴𝚇𝙰𝙼𝙿𝙻𝙴𝚂:*\n*• .gemini what is machine learning?*\n*• .gemini explain blockchain technology*\n*• .gemini latest news about space exploration*\n*• .gemini how does photosynthesis work?*\n\n*𝚆𝚁𝙸𝚃𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ❮𝙶𝙴𝙼𝙸𝙽𝙸❯ 𝙰𝙽𝙳 𝚈𝙾𝚄𝚁 𝚀𝚄𝙴𝚂𝚃𝙸𝙾𝙽 🔮*\n*𝙶𝙴𝙼𝙸𝙽𝙸 𝚆𝙸𝙻𝙻 𝙿𝚁𝙾𝚅𝙸𝙳𝙴 𝙰𝙲𝙲𝚄𝚁𝙰𝚃𝙴 𝙰𝙽𝚂𝚆𝙴𝚁𝚂 ✨*`
                }, { quoted: msg });
            }

            await sock.sendMessage(from, {
                text: `*🔮 𝙶𝙴𝙼𝙸𝙽𝙸 𝙸𝚂 𝚃𝙷𝙸𝙽𝙺𝙸𝙽𝙶...*\n\n*📝 𝚀𝚞𝚎𝚜𝚝𝚒𝚘𝚗: ${text}*\n*⏳ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝, 𝙶𝚎𝚖𝚒𝚗𝚒 𝚒𝚜 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚗𝚐 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚎...*`
            }, { quoted: msg });

            const apiUrl = `https://okatsu-rolezapiiz.vercel.app/ai/gemini?query=${encodeURIComponent(text)}`;
            
            const response = await axios.get(apiUrl, { timeout: 30000 });
            const data = response.data;

            if (!data || !data.result) {
                throw new Error('No response from Gemini');
            }

            await sock.sendMessage(from, {
                text: `*🔮 𝙶𝙾𝙾𝙶𝙻𝙴 𝙶𝙴𝙼𝙸𝙽𝙸 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴 🔮*\n\n*📝 𝚀𝚞𝚎𝚜𝚝𝚒𝚘𝚗:* ${text}\n\n*💭 𝙰𝚗𝚜𝚠𝚎𝚛:* ${data.result}\n\n*✨ 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳*`
            }, { quoted: msg });

        } catch (error) {
            console.error('Gemini Error:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `*❌ 𝙶𝙴𝙼𝙸𝙽𝙸 𝙴𝚁𝚁𝙾𝚁*\n\n*𝙴𝚛𝚛𝚘𝚛: ${error.message}*\n*𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛 𝚘𝚛 𝚞𝚜𝚎 𝚊 𝚍𝚒𝚏𝚏𝚎𝚛𝚎𝚗𝚝 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗.*\n\n*✨ 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳*`
            }, { quoted: msg });
        }
    }
};
