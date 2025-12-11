const axios = require('axios');

module.exports = {
    command: "gpt",
    alias: ["ai", "chat", "ask", "openai"],
    desc: "Chat with GPT AI model",
    category: "ai",
    react: "🤖",
    filename: __filename,

    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;
            const text = args.join(" ").trim();

            if (!text) {
                return await sock.sendMessage(from, {
                    text: `*🤖 𝙶𝙿𝚃 𝙰𝙸 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 🤖*\n\n*𝙰𝚂𝙺 𝙰𝙽𝚈𝚃𝙷𝙸𝙽𝙶 𝚃𝙾 𝙶𝙿𝚃 𝙰𝙸 𝙼𝙾𝙳𝙴𝙻 🧠*\n*𝚆𝚁𝙸𝚃𝙴 𝙻𝙸𝙺𝙴 𝚃𝙷𝙸𝚂 ☺️*\n\n*🤖 𝙶𝙿𝚃 ❮𝚈𝙾𝚄𝚁 𝚀𝚄𝙴𝚂𝚃𝙸𝙾𝙽❯*\n\n*𝙴𝚇𝙰𝙼𝙿𝙻𝙴𝚂:*\n*• .gpt what is artificial intelligence?*\n*• .gpt explain quantum computing*\n*• .gpt write a poem about the moon*\n*• .gpt how to learn programming?*\n\n*𝚆𝚁𝙸𝚃𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ❮𝙶𝙿𝚃❯ 𝙰𝙽𝙳 𝚈𝙾𝚄𝚁 𝚀𝚄𝙴𝚂𝚃𝙸𝙾𝙽 🤖*\n*𝙶𝙿𝚃 𝚆𝙸𝙻𝙻 𝙿𝚁𝙾𝚅𝙸𝙳𝙴 𝙰 𝙳𝙴𝚃𝙰𝙸𝙻𝙴𝙳 𝙰𝙽𝚂𝚆𝙴𝚁 ✨*`
                }, { quoted: msg });
            }

            await sock.sendMessage(from, {
                text: `*🤖 𝙶𝙿𝚃 𝙸𝚂 𝚃𝙷𝙸𝙽𝙺𝙸𝙽𝙶...*\n\n*📝 𝚀𝚞𝚎𝚜𝚝𝚒𝚘𝚗: ${text}*\n*⏳ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝, 𝙶𝙿𝚃 𝚒𝚜 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚗𝚐 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚎...*`
            }, { quoted: msg });

            const apiUrl = `https://okatsu-rolezapiiz.vercel.app/ai/chat?query=${encodeURIComponent(text)}`;
            
            const response = await axios.get(apiUrl, { timeout: 30000 });
            const data = response.data;

            if (!data || !data.result) {
                throw new Error('No response from GPT');
            }

            await sock.sendMessage(from, {
                text: `*🤖 𝙶𝙿𝚃 𝙰𝙸 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴 🤖*\n\n*📝 𝚀𝚞𝚎𝚜𝚝𝚒𝚘𝚗:* ${text}\n\n*💭 𝙰𝚗𝚜𝚠𝚎𝚛:* ${data.result}\n\n*✨ 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳*`
            }, { quoted: msg });

        } catch (error) {
            console.error('GPT Error:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `*❌ 𝙶𝙿𝚃 𝙴𝚁𝚁𝙾𝚁*\n\n*𝙴𝚛𝚛𝚘𝚛: ${error.message}*\n*𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛 𝚘𝚛 𝚞𝚜𝚎 𝚊 𝚍𝚒𝚏𝚏𝚎𝚛𝚎𝚗𝚝 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗.*\n\n*✨ 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳*`
            }, { quoted: msg });
        }
    }
};
