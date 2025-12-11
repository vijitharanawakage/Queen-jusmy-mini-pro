const axios = require('axios');
const fs = require('fs');

module.exports = {
    command: "apk2",
    alias: ["apkdownload", "downloadapk", "getapk", "apk"],
    desc: "Download APK files from APKPure",
    category: "download",
    react: "📱",
    filename: __filename,

    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;
            const text = args.join(" ").trim();

            if (!text) {
                return await sock.sendMessage(from, {
                    text: `*📱 𝙰𝙿𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 📱*\n\n*𝙳𝙾 𝚈𝙾𝚄 𝚆𝙰𝙽𝚃 𝚃𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙰𝙽 𝙰𝙿𝙺 𝙵𝙸𝙻𝙴? 🥺*\n*𝚃𝙷𝙴𝙽 𝚆𝚁𝙸𝚃𝙴 𝙻𝙸𝙺𝙴 𝚃𝙷𝙸𝚂 ☺️*\n\n*📱 𝙰𝙿𝙺𝟸 ❮𝙰𝙿𝙿 𝙽𝙰𝙼𝙴❯*\n\n*𝙴𝚇𝙰𝙼𝙿𝙻𝙴𝚂:*\n*• .apk2 whatsapp*\n*• .apk2 facebook*\n*• .apk2 tiktok*\n*• .apk2 spotify*\n\n*𝚆𝚁𝙸𝚃𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 ❮𝙰𝙿𝙺𝟸❯ 𝙰𝙽𝙳 𝙰𝙿𝙿 𝙽𝙰𝙼𝙴 ☺️*\n*𝚃𝙷𝙴𝙽 𝚈𝙾𝚄 𝚆𝙸𝙻𝙻 𝙶𝙴𝚃 𝙰𝙿𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙻𝙸𝙽𝙺𝚂 📲✨*`
                }, { quoted: msg });
            }

            // Send searching message
            await sock.sendMessage(from, {
                text: `*🔍 𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶 𝙵𝙾𝚁 𝙰𝙿𝙺...*\n\n*📱 𝙰𝚙𝚙: ${text}*\n*⏳ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝, 𝚜𝚎𝚊𝚛𝚌𝚑𝚒𝚗𝚐 𝚏𝚘𝚛 𝙰𝙿𝙺 𝚏𝚒𝚕𝚎𝚜...*`
            }, { quoted: msg });

            // API URL for APK search
            const searchUrl = `https://api.bk9.dev/download/apk?id=${encodeURIComponent(text)}`;
            
            console.log(`🔍 Searching APK for: ${text}`);

            // Make API request
            const response = await axios.get(searchUrl, {
                timeout: 30000 // 30 seconds timeout
            });

            const data = response.data;

            if (!data || data.error) {
                throw new Error(data?.error || 'No APK data found');
            }

            // Format the response based on API structure
            let resultMessage = `*📱 𝙰𝙿𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝚁𝙴𝚂𝚄𝙻𝚃𝚂 📱*\n\n`;
            
            if (data.name) {
                resultMessage += `*📛 𝙽𝚊𝚖𝚎:* ${data.name}\n`;
            }
            
            if (data.version) {
                resultMessage += `*🔄 𝚅𝚎𝚛𝚜𝚒𝚘𝚗:* ${data.version}\n`;
            }
            
            if (data.size) {
                resultMessage += `*📦 𝚂𝚒𝚣𝚎:* ${data.size}\n`;
            }
            
            if (data.developer) {
                resultMessage += `*👨‍💻 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛:* ${data.developer}\n`;
            }
            
            if (data.download_url) {
                resultMessage += `\n*⬇️ 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙻𝙸𝙽𝙺:*\n${data.download_url}\n`;
            }
            
            if (data.downloads) {
                resultMessage += `*📊 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚜:* ${data.downloads}\n`;
            }
            
            if (data.updated) {
                resultMessage += `*📅 𝚄𝚙𝚍𝚊𝚝𝚎𝚍:* ${data.updated}\n`;
            }

            resultMessage += `\n*💡 𝙸𝙽𝚂𝚃𝚁𝚄𝙲𝚃𝙸𝙾𝙽𝚂:*\n`;
            resultMessage += `• 𝙲𝚕𝚒𝚌𝚔 𝚝𝚑𝚎 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚕𝚒𝚗𝚔 𝚊𝚋𝚘𝚟𝚎\n`;
            resultMessage += `• 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚝𝚑𝚎 𝙰𝙿𝙺 𝚏𝚒𝚕𝚎\n`;
            resultMessage += `• 𝙸𝚗𝚜𝚝𝚊𝚕𝚕 𝚘𝚗 𝚢𝚘𝚞𝚛 𝙰𝚗𝚍𝚛𝚘𝚒𝚍 𝚍𝚎𝚟𝚒𝚌𝚎\n`;
            resultMessage += `• 𝙴𝚗𝚊𝚋𝚕𝚎 "𝙸𝚗𝚜𝚝𝚊𝚕𝚕 𝚏𝚛𝚘𝚖 𝚞𝚗𝚔𝚗𝚘𝚠𝚗 𝚜𝚘𝚞𝚛𝚌𝚎𝚜" 𝚒𝚏 𝚗𝚎𝚎𝚍𝚎𝚍\n\n`;
            resultMessage += `*⚠️ 𝚆𝙰𝚁𝙽𝙸𝙽𝙶:*\n`;
            resultMessage += `• 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚏𝚛𝚘𝚖 𝚝𝚛𝚞𝚜𝚝𝚎𝚍 𝚜𝚘𝚞𝚛𝚌𝚎𝚜 𝚘𝚗𝚕𝚢\n`;
            resultMessage += `• 𝚂𝚌𝚊𝚗 𝚏𝚘𝚛 𝚟𝚒𝚛𝚞𝚜𝚎𝚜 𝚋𝚎𝚏𝚘𝚛𝚎 𝚒𝚗𝚜𝚝𝚊𝚕𝚕𝚒𝚗𝚐\n`;
            resultMessage += `• 𝚄𝚜𝚎 𝚊𝚝 𝚢𝚘𝚞𝚛 𝚘𝚠𝚗 𝚛𝚒𝚜𝚔\n\n`;
            resultMessage += `*📱 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳*`;

            // Send the result
            await sock.sendMessage(from, {
                text: resultMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363422610520277@newsletter',
                        newsletterName: '📱 𝚂𝙸𝙻𝙰 𝙼𝙳 𝙰𝙿𝙺 📱',
                        serverMessageId: 143
                    }
                }
            }, { quoted: msg });

            console.log(`✅ APK search completed for: ${text}`);

        } catch (error) {
            console.error('❌ APK Search Error:', error);
            
            let errorMessage = '*❌ 𝙰𝙿𝙺 𝚂𝙴𝙰𝚁𝙲𝙷 𝙵𝙰𝙸𝙻𝙴𝙳*\n\n';
            
            if (error.response?.status === 404) {
                errorMessage += '*🚫 𝙰𝙿𝙺 𝙽𝙾𝚃 𝙵𝙾𝚄𝙽𝙳*\n*📛 𝙽𝚘 𝙰𝙿𝙺 𝚏𝚘𝚞𝚗𝚍 𝚏𝚘𝚛 𝚝𝚑𝚊𝚝 𝚊𝚙𝚙 𝚗𝚊𝚖𝚎. 𝚃𝚛𝚢 𝚊 𝚍𝚒𝚏𝚏𝚎𝚛𝚎𝚗𝚝 𝚗𝚊𝚖𝚎.*';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage += '*⏰ 𝚁𝙴𝚀𝚄𝙴𝚂𝚃 𝚃𝙸𝙼𝙴𝙳 𝙾𝚄𝚃*\n*📛 𝚂𝚎𝚊𝚛𝚌𝚑 𝚝𝚘𝚘𝚔 𝚝𝚘𝚘 𝚕𝚘𝚗𝚐. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗.*';
            } else if (error.response?.status === 429) {
                errorMessage += '*📛 𝙰𝙿𝙸 𝙻𝙸𝙼𝙸𝚃 𝙴𝚇𝙲𝙴𝙴𝙳𝙴𝙳*\n*🚫 𝚃𝚘𝚘 𝚖𝚊𝚗𝚢 𝚛𝚎𝚚𝚞𝚎𝚜𝚝𝚜. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.*';
            } else {
                errorMessage += '*🔧 𝚂𝙴𝚁𝚅𝙴𝚁 𝙴𝚁𝚁𝙾𝚁*\n*📛 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛 𝚘𝚛 𝚞𝚜𝚎 𝚊 𝚍𝚒𝚏𝚏𝚎𝚛𝚎𝚗𝚝 𝚊𝚙𝚙 𝚗𝚊𝚖𝚎.*';
            }

            errorMessage += '\n\n*💡 𝚃𝙸𝙿𝚂:*\n• 𝚄𝚜𝚎 𝚎𝚡𝚊𝚌𝚝 𝚊𝚙𝚙 𝚗𝚊𝚖𝚎\n• 𝚃𝚛𝚢 𝚙𝚘𝚙𝚞𝚕𝚊𝚛 𝚊𝚙𝚙𝚜 𝚏𝚒𝚛𝚜𝚝\n• 𝙲𝚑𝚎𝚌𝚔 𝚜𝚙𝚎𝚕𝚕𝚒𝚗𝚐\n\n*📱 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳*';

            await sock.sendMessage(msg.key.remoteJid, {
                text: errorMessage
            }, { quoted: msg });
        }
    }
};
