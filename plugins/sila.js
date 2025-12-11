const axios = require('axios');

module.exports = {
    command: "sila",
    alias: ["silaai", "silaimg", "sailor", "sailormoon"],
    desc: "Generate AI images using SILA AI model",
    category: "ai",
    react: "🌙",
    filename: __filename,

    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;
            const text = args.join(" ").trim();

            if (!text) {
                return await sock.sendMessage(from, {
                    text: `*🌙 𝚂𝙸𝙻𝙰 𝙰𝙸 𝙸𝙼𝙰𝙶𝙴 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙾𝚁 🌙*\n\n*𝙳𝙾 𝚈𝙾𝚄 𝚆𝙰𝙽𝚃 𝚃𝙾 𝙲𝚁𝙴𝙰𝚃𝙴 𝙼𝙰𝙶𝙸𝙲𝙰𝙻 𝙰𝙸 𝙸𝙼𝙰𝙶𝙴𝚂? 🌟*\n*𝚃𝙷𝙴𝙽 𝚆𝚁𝙸𝚃𝙴 𝙻𝙸𝙺𝙴 𝚃𝙷𝙸𝚂 ☺️*\n\n*🌙 𝚂𝙸𝙻𝙰 ❮𝚈𝙾𝚄𝚁 𝙸𝙼𝙰𝙶𝙴 𝙿𝚁𝙾𝙼𝙿𝚃❯*\n\n*𝙴𝚇𝙰𝙼𝙿𝙻𝙴𝚂:*\n*• .sila beautiful anime girl*\n*• .sila fantasy landscape with castle*\n*• .sila cyberpunk city at night*\n*• .sila magical forest with fairies*\n\n*𝚆𝚁𝙸𝚃𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ❮𝚂𝙸𝙻𝙰❯ 𝙰𝙽𝙳 𝚈𝙾𝚄𝚁 𝙲𝚁𝙴𝙰𝚃𝙸𝚅𝙴 𝙿𝚁𝙾𝙼𝙿𝚃 🌙*\n*𝚃𝙷𝙴𝙽 𝚂𝙸𝙻𝙰 𝙰𝙸 𝚆𝙸𝙻𝙻 𝙲𝚁𝙴𝙰𝚃𝙴 𝙰 𝙼𝙰𝙶𝙸𝙲𝙰𝙻 𝙸𝙼𝙰𝙶𝙴 𝙵𝙾𝚁 𝚈𝙾𝚄 ✨*`
                }, { quoted: msg });
            }

            // Check for inappropriate content
            const inappropriateWords = ['nude', 'naked', 'porn', 'xxx', 'adult', 'explicit', 'sex', 'erotic', 'bikini', 'swimsuit', 'lingerie'];
            const hasInappropriate = inappropriateWords.some(word => 
                text.toLowerCase().includes(word.toLowerCase())
            );

            if (hasInappropriate) {
                return await sock.sendMessage(from, {
                    text: `*🚫 𝙲𝙾𝙽𝚃𝙴𝙽𝚃 𝚆𝙰𝚁𝙽𝙸𝙽𝙶 🚫*\n\n*𝚈𝙾𝚄𝚁 𝙿𝚁𝙾𝙼𝙿𝚃 𝙲𝙾𝙽𝚃𝙰𝙸𝙽𝚂 𝙸𝙽𝙰𝙿𝙿𝚁𝙾𝙿𝚁𝙸𝙰𝚃𝙴 𝙲𝙾𝙽𝚃𝙴𝙽𝚃*\n\n*📛 𝙿𝚕𝚎𝚊𝚜𝚎 𝚞𝚜𝚎 𝚊𝚙𝚙𝚛𝚘𝚙𝚛𝚒𝚊𝚝𝚎 𝚊𝚗𝚍 𝚜𝚊𝚏𝚎 𝚙𝚛𝚘𝚖𝚙𝚝𝚜:*\n• 𝙰𝚗𝚒𝚖𝚎 𝚌𝚑𝚊𝚛𝚊𝚌𝚝𝚎𝚛𝚜\n• 𝙵𝚊𝚗𝚝𝚊𝚜𝚢 𝚕𝚊𝚗𝚍𝚜𝚌𝚊𝚙𝚎𝚜\n• 𝙲𝚢𝚋𝚎𝚛𝚙𝚞𝚗𝚔 𝚜𝚌𝚎𝚗𝚎𝚜\n• 𝙼𝚊𝚐𝚒𝚌𝚊𝚕 𝚌𝚛𝚎𝚊𝚝𝚞𝚛𝚎𝚜\n• 𝙽𝚊𝚝𝚞𝚛𝚎 𝚜𝚌𝚎𝚗𝚎𝚛𝚢\n\n*🌙 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳*`
                }, { quoted: msg });
            }

            // Send processing message
            await sock.sendMessage(from, {
                text: `*🌙 𝚂𝙸𝙻𝙰 𝙰𝙸 𝙸𝚂 𝙲𝚁𝙴𝙰𝚃𝙸𝙽𝙶 𝚈𝙾𝚄𝚁 𝙼𝙰𝙶𝙸𝙲...*\n\n*📝 𝙿𝚛𝚘𝚖𝚙𝚝: ${text}*\n*⏳ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝, 𝚝𝚑𝚒𝚜 𝚖𝚊𝚢 𝚝𝚊𝚔𝚎 𝚊 𝚏𝚎𝚠 𝚖𝚘𝚖𝚎𝚗𝚝𝚜...*`
            }, { quoted: msg });

            // API URL
            const apiUrl = `https://shizoapi.onrender.com/api/ai/imagine?apikey=shizo&query=${encodeURIComponent(text)}`;
            
            console.log(`🌙 Generating SILA AI image for prompt: ${text}`);

            // Make API request
            const response = await axios.get(apiUrl, {
                responseType: 'arraybuffer',
                timeout: 60000 // 60 seconds timeout
            });

            if (!response.data) {
                throw new Error('No image data received from API');
            }

            // Convert to buffer
            const imageBuffer = Buffer.from(response.data, 'binary');

            // Send the generated image
            await sock.sendMessage(from, {
                image: imageBuffer,
                caption: `*🌙 𝚂𝙸𝙻𝙰 𝙰𝙸 𝙼𝙰𝙶𝙸𝙲𝙰𝙻 𝙸𝙼𝙰𝙶𝙴 🌙*\n\n*📝 𝙿𝚛𝚘𝚖𝚙𝚝:* ${text}\n*🎨 𝙼𝚘𝚍𝚎𝚕:* SILA AI\n*✨ 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝙱𝚢 𝚂𝙸𝙻𝙰 𝙼𝙳*`,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363422610520277@newsletter',
                        newsletterName: '🌙 𝚂𝙸𝙻𝙰 𝙰𝙸 𝙼𝙰𝙶𝙸𝙲 🌙',
                        serverMessageId: 143
                    }
                }
            }, { quoted: msg });

            console.log(`✅ SILA AI image generated successfully for: ${text}`);

        } catch (error) {
            console.error('❌ SILA AI Image Generation Error:', error);
            
            let errorMessage = '*❌ 𝚂𝙸𝙻𝙰 𝙰𝙸 𝙵𝙰𝙸𝙻𝙴𝙳 𝚃𝙾 𝙲𝚁𝙴𝙰𝚃𝙴 𝙼𝙰𝙶𝙸𝙲*\n\n';
            
            if (error.response?.status === 429) {
                errorMessage += '*📛 𝙰𝙿𝙸 𝙻𝙸𝙼𝙸𝚃 𝙴𝚇𝙲𝙴𝙴𝙳𝙴𝙳*\n*🚫 𝚃𝚘𝚘 𝚖𝚊𝚗𝚢 𝚛𝚎𝚚𝚞𝚎𝚜𝚝𝚜. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.*';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage += '*⏰ 𝚁𝙴𝚀𝚄𝙴𝚂𝚃 𝚃𝙸𝙼𝙴𝙳 𝙾𝚄𝚃*\n*📛 𝙸𝚖𝚊𝚐𝚎 𝚌𝚛𝚎𝚊𝚝𝚒𝚘𝚗 𝚝𝚘𝚘𝚔 𝚝𝚘𝚘 𝚕𝚘𝚗𝚐. 𝚃𝚛𝚢 𝚊 𝚜𝚒𝚖𝚙𝚕𝚎𝚛 𝚙𝚛𝚘𝚖𝚙𝚝.*';
            } else if (error.response?.status === 400) {
                errorMessage += '*🚫 𝙸𝙽𝚅𝙰𝙻𝙸𝙳 𝙿𝚁𝙾𝙼𝙿𝚃*\n*📛 𝚈𝚘𝚞𝚛 𝚙𝚛𝚘𝚖𝚙𝚝 𝚖𝚊𝚢 𝚌𝚘𝚗𝚝𝚊𝚒𝚗 𝚒𝚗𝚊𝚙𝚙𝚛𝚘𝚙𝚛𝚒𝚊𝚝𝚎 𝚌𝚘𝚗𝚝𝚎𝚗𝚝.*';
            } else if (error.response?.status === 403) {
                errorMessage += '*🔒 𝙰𝙿𝙸 𝙺𝙴𝚈 𝙴𝚁𝚁𝙾𝚁*\n*📛 𝙰𝙿𝙸 𝚔𝚎𝚢 𝚒𝚜 𝚒𝚗𝚟𝚊𝚕𝚒𝚍 𝚘𝚛 𝚎𝚡𝚙𝚒𝚛𝚎𝚍.*';
            } else {
                errorMessage += '*🔧 𝚂𝙴𝚁𝚅𝙴𝚁 𝙴𝚁𝚁𝙾𝚁*\n*📛 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛 𝚘𝚛 𝚞𝚜𝚎 𝚊 𝚍𝚒𝚏𝚏𝚎𝚛𝚎𝚗𝚝 𝚙𝚛𝚘𝚖𝚙𝚝.*';
            }

            errorMessage += '\n\n*💡 𝚃𝙸𝙿𝚂 𝙵𝙾𝚁 𝙱𝙴𝚃𝚃𝙴𝚁 𝙸𝙼𝙰𝙶𝙴𝚂:*\n';
            errorMessage += '• 𝚄𝚜𝚎 𝚍𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚟𝚎, 𝚌𝚛𝚎𝚊𝚝𝚒𝚟𝚎 𝚙𝚛𝚘𝚖𝚙𝚝𝚜\n';
            errorMessage += '• 𝙰𝚍𝚍 𝚜𝚝𝚢𝚕𝚎 𝚔𝚎𝚢𝚠𝚘𝚛𝚍𝚜 (𝚊𝚗𝚒𝚖𝚎, 𝚛𝚎𝚊𝚕𝚒𝚜𝚝𝚒𝚌, 𝚏𝚊𝚗𝚝𝚊𝚜𝚢)\n';
            errorMessage += '• 𝙳𝚎𝚜𝚌𝚛𝚒𝚋𝚎 𝚌𝚘𝚕𝚘𝚛𝚜, 𝚕𝚒𝚐𝚑𝚝𝚒𝚗𝚐, 𝚊𝚗𝚍 𝚖𝚘𝚘𝚍\n';
            errorMessage += '• 𝙺𝚎𝚎𝚙 𝚙𝚛𝚘𝚖𝚙𝚝𝚜 𝚊𝚙𝚙𝚛𝚘𝚙𝚛𝚒𝚊𝚝𝚎 𝚊𝚗𝚍 𝚜𝚊𝚏𝚎\n\n';
            errorMessage += '*🌙 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳*';

            await sock.sendMessage(msg.key.remoteJid, {
                text: errorMessage
            }, { quoted: msg });
        }
    }
};
