const axios = require('axios');
const { prefix: PREFIX } = require('../config');

const thumbUrl = "https://files.catbox.moe/4gca2n.png";

async function sendUnknownCommandReply(sock, msg, sender) {
  try {
   
    const { data: thumbBuffer } = await axios.get(thumbUrl, { responseType: 'arraybuffer' });

    const jid = msg.key.remoteJid;

    await sock.sendMessage(jid, {
      text: `> *❌ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ᴅᴏᴇꜱ ɴᴏᴛ ᴇxɪꜱᴛ.*\n\n_🔁ᴘʟᴇᴀꜱᴇ ᴛʏᴘᴇ \`${PREFIX}menu\` ᴀɴᴅ ᴛʀʏ ᴀɢᴀɪɴ._`,
      contextInfo: {
        mentionedJid: [sender, "94741259325@s.whatsapp.net"],
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "META AI • Command Not Found",
          body: "",
          mediaType: 2,
          thumbnailUrl: thumbUrl,
          jpegThumbnail: thumbBuffer,
          sourceUrl: "https://wa.me/13135550002?s=5",
        },
      },
    });
  } catch (error) {
    console.error("❌ Error sending unknown command reply:", error);
    await sock.sendMessage(msg.from, {
      text: `> *❌ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ᴅᴏᴇꜱ ɴᴏᴛ ᴇxɪꜱᴛ.*\n\n_🔁 ᴘʟᴇᴀꜱᴇ ᴛʏᴘᴇ \`${PREFIX}menu\` ᴀɴᴅ ᴛʀʏ ᴀɢᴀɪɴ._`,
    });
  }
}

module.exports = {
  sendUnknownCommandReply,
};
