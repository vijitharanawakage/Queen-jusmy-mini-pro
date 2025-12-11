const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const router = express.Router();
const pino = require('pino');
const cheerio = require('cheerio');
const { Octokit } = require('@octokit/rest');
const os = require('os');
const moment = require('moment-timezone');
const Jimp = require('jimp');
const crypto = require('crypto');
const axios = require('axios');
var { updateCMDStore,isbtnID,getCMDStore,getCmdForCmdId,connectdb,input,get,updb,updfb } = require("./lib/database")
var id_db = require('./lib/id_db')    

const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    jidNormalizedUser,
    getContentType,
    proto,
    prepareWAMessageMedia,
    generateWAMessageFromContent
} = require('@whiskeysockets/baileys');

const config = {
   WELCOME: 'true',
    AUTO_VIEW_STATUS: 'true',
    AUTO_VOICE: 'true',
    AUTO_LIKE_STATUS: 'true',
    AUTO_RECORDING: 'false',
    HEROKU_APP_URL: 'https://sila-md-mini-bot-s1.onrender.com/',
    AUTO_LIKE_EMOJI: ['🥹', '👍', '😍', '💗', '🎈', '🎉', '🥳', '😎', '🚀', '🔥'],
    PREFIX: '.',
    MAX_RETRIES: 3,
    GROUP_INVITE_LINK: 'https://chat.whatsapp.com/IdGNaKt80DEBqirc2ek4ks',
    ADMIN_LIST_PATH: './lib/admin.json',
    RCD_IMAGE_PATH: 'https://files.catbox.moe/90i7j4.png',
    NEWSLETTER_JID: '120363422610520277@newsletter',
    NEWSLETTER_MESSAGE_ID: '428',
    OTP_EXPIRY: 300000,
    OWNER_NUMBER: '255612491554',
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbBPxQTJUM2WCZLB6j28',
    AUTO_TYPING: 'true',
    ANTI_LINK: 'true',
    ANTI_DELETE: 'true',
    AUTO_REPLY_STATUS: 'true',
    STATUS_AI_REPLY: 'true',
    AUTO_REPLIES: 'true'   
}

// Auto-reply messages
const autoReplies = {
    'hi': '𝙷𝚎𝚕𝚕𝚘! 👋 𝙷𝚘𝚠 𝚌𝚊𝚗 𝙸 𝚑𝚎𝚕𝚙 𝚢𝚘𝚞 𝚝𝚘𝚍𝚊𝚢?',
    'mambo': '𝙿𝚘𝚊 𝚜𝚊𝚗𝚊! 👋 𝙽𝚒𝚔𝚞𝚜𝚊𝚒𝚍𝚒𝚎 𝙺𝚞𝚑𝚞𝚜𝚞?',
    'hey': '𝙷𝚎𝚢 𝚝𝚑𝚎𝚛𝚎! 😊 𝚄𝚜𝚎 .𝚖𝚎𝚗𝚞 𝚝𝚘 𝚜𝚎𝚎 𝚊𝚕𝚕 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜.',
    'vip': '𝙷𝚎𝚕𝚕𝚘 𝚅𝙸𝙿! 🐢 𝙷𝚘𝚠 𝚌𝚊𝚗 𝙸 𝚊𝚜𝚜𝚒𝚜𝚝 𝚢𝚘𝚞?',
    'mkuu': '𝙷𝚎𝚢 𝚖𝚔𝚞𝚞! 👋 𝙽𝚒𝚔𝚞𝚜𝚊𝚒𝚍𝚒𝚎 𝙺𝚞𝚑𝚞𝚜𝚞?',
    'boss': '𝚈𝚎𝚜 𝚋𝚘𝚜𝚜! 🐢 𝙷𝚘𝚠 𝚌𝚊𝚗 𝙸 𝚑𝚎𝚕𝚙 𝚢𝚘𝚞?',
    'habari': '𝙽𝚣𝚞𝚛𝚒 𝚜𝚊𝚗𝚊! 👋 𝙷𝚊𝚋𝚊𝚛𝚒 𝚢𝚊𝚔𝚘?',
    'hello': '𝙷𝚒 𝚝𝚑𝚎𝚛𝚎! 😊 𝚄𝚜𝚎 .𝚖𝚎𝚗𝚞 𝚝𝚘 𝚜𝚎𝚎 𝚊𝚕𝚕 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜.',
    'bot': '𝚈𝚎𝚜, 𝙸 𝚊𝚖 𝚂𝙸𝙻𝙰 𝙼𝙳 𝙼𝙸𝙽𝙸! 🤖 𝙷𝚘𝚠 𝚌𝚊𝚗 𝙸 𝚊𝚜𝚜𝚒𝚜𝚝 𝚢𝚘𝚞?',
    'menu': '𝚃𝚢𝚙𝚎 .𝚖𝚎𝚗𝚞 𝚝𝚘 𝚜𝚎𝚎 𝚊𝚕𝚕 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜! 📜',
    'owner': '𝙲𝚘𝚗𝚝𝚊𝚌𝚝 𝚘𝚠𝚗𝚎𝚛 𝚞𝚜𝚒𝚗𝚐 .𝚘𝚠𝚗𝚎𝚛 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 🐢',
    'thanks': '𝚈𝚘𝚞\'𝚛𝚎 𝚠𝚎𝚕𝚌𝚘𝚖𝚎! 😊',
    'thank you': '𝙰𝚗𝚢𝚝𝚒𝚖𝚎! 𝙻𝚎𝚝 𝚖𝚎 𝚔𝚗𝚘𝚠 𝚒𝚏 𝚢𝚘𝚞 𝚗𝚎𝚎𝚍 𝚑𝚎𝚕𝚙 🤖'           
}

const octokit = new Octokit({ auth: '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' });
const owner = 'SILA';
const repo = 'SILA-MD-s1';

const activeSockets = new Map();
const socketCreationTime = new Map();
const SESSION_BASE_PATH = './session';
const NUMBER_LIST_PATH = './numbers.json';
const otpStore = new Map();

if (!fs.existsSync(SESSION_BASE_PATH)) {
    fs.mkdirSync(SESSION_BASE_PATH, { recursive: true });
}

function loadAdmins() {
    try {
        if (fs.existsSync(config.ADMIN_LIST_PATH)) {
            return JSON.parse(fs.readFileSync(config.ADMIN_LIST_PATH, 'utf8'));
        }
        return [];
    } catch (error) {
        console.error('Failed to load admin list:', error);
        return [];
    }
}

function formatMessage(title, content, footer) {
    return `*${title}*\n\n${content}\n\n> *${footer}*`;
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getSriLankaTimestamp() {
    return moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
}

async function cleanDuplicateFiles(number) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const { data } = await octokit.repos.getContent({
            owner,
            repo,
            path: 'session'
        });

        const sessionFiles = data.filter(file => 
            file.name.startsWith(`sila_${sanitizedNumber}_`) && file.name.endsWith('.json')
        ).sort((a, b) => {
            const timeA = parseInt(a.name.match(/sila_\d+_(\d+)\.json/)?.[1] || 0);
            const timeB = parseInt(b.name.match(/sila_\d+_(\d+)\.json/)?.[1] || 0);
            return timeB - timeA;
        });

        const configFiles = data.filter(file => 
            file.name === `config_${sanitizedNumber}.json`
        );

        if (sessionFiles.length > 1) {
            for (let i = 1; i < sessionFiles.length; i++) {
                await octokit.repos.deleteFile({
                    owner,
                    repo,
                    path: `session/${sessionFiles[i].name}`,
                    message: `Delete duplicate session file for ${sanitizedNumber}`,
                    sha: sessionFiles[i].sha
                });
                console.log(`Deleted duplicate session file: ${sessionFiles[i].name}`);
            }
        }

        if (configFiles.length > 0) {
            console.log(`Config file for ${sanitizedNumber} already exists`);
        }
    } catch (error) {
        console.error(`Failed to clean duplicate files for ${number}:`, error);
    }
}

async function joinGroup(socket) {
    let retries = config.MAX_RETRIES;
    const inviteCodeMatch = config.GROUP_INVITE_LINK.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
    if (!inviteCodeMatch) {
        console.error('Invalid group invite link format');
        return { status: 'failed', error: 'Invalid group invite link' };
    }
    const inviteCode = inviteCodeMatch[1];

    while (retries > 0) {
        try {
            const response = await socket.groupAcceptInvite(inviteCode);
            if (response?.gid) {
                console.log(`Successfully joined group with ID: ${response.gid}`);
                return { status: 'success', gid: response.gid };
            }
            throw new Error('No group ID in response');
        } catch (error) {
            retries--;
            let errorMessage = error.message || 'Unknown error';
            if (error.message.includes('not-authorized')) {
                errorMessage = 'Bot is not authorized to join (possibly banned)';
            } else if (error.message.includes('conflict')) {
                errorMessage = 'Bot is already a member of the group';
            } else if (error.message.includes('gone')) {
                errorMessage = 'Group invite link is invalid or expired';
            }
            if (retries === 0) {
                return { status: 'failed', error: errorMessage };
            }
            await delay(2000 * (config.MAX_RETRIES - retries));
        }
    }
    return { status: 'failed', error: 'Max retries reached' };
}

async function followChannel(socket) {
    try {
        await socket.newsletterFollow(config.NEWSLETTER_JID);
        console.log('✅ Successfully followed channel');
        return { status: 'success' };
    } catch (error) {
        console.error('❌ Failed to follow channel:', error);
        return { status: 'failed', error: error.message };
    }
}

async function sendAdminConnectMessage(socket, number, groupResult, channelResult) {
    const admins = loadAdmins();
    const groupStatus = groupResult.status === 'success'
        ? `Joined (ID: ${groupResult.gid})`
        : `Failed to join group: ${groupResult.error}`;
    const channelStatus = channelResult.status === 'success'
        ? 'Followed successfully'
        : `Failed to follow channel: ${channelResult.error}`;
    
    const caption = formatMessage(
        '*⟪════════ ♢.✰.♢ ════════⟫*\n*🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 𝙼𝙸𝙽𝙸 𝙱𝙾𝚃 🐢*',
        ` *🐢 𝚂𝚃𝙰𝚁𝚃𝙴𝙳 𝙰𝙽𝙳 𝚆𝙾𝚁𝙺𝙸𝙽𝙶 🐢*\n*🐢  𝚄𝚂𝙴𝚁 :❯ +${number}*\n*⟪════════ ♢.✰.♢ ════════⟫*`
    );

    for (const admin of admins) {
        try {
            await socket.sendMessage(
                `${admin}@s.whatsapp.net`,
                {
                    image: { url: config.RCD_IMAGE_PATH },
                    caption
                }
            );
        } catch (error) {
            console.error(`Failed to send connect message to admin ${admin}:`, error);
        }
    }
}

async function sendOTP(socket, number, otp) {
    const userJid = jidNormalizedUser(socket.user.id);
    const message = formatMessage(
        '🔐 𝙾𝚃𝙿 𝚅𝙴𝚁𝙸𝙵𝙸𝙲𝙰𝚃𝙸𝙾𝙽',
        `Your OTP for config update is: *${otp}*\nThis OTP will expire in 5 minutes.`,
        '*🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 𝙼𝙸𝙽𝙸 𝙱𝙾𝚃 🐢*'
    );

    try {
        await socket.sendMessage(userJid, { text: message });
        console.log(`OTP ${otp} sent to ${number}`);
    } catch (error) {
        console.error(`Failed to send OTP to ${number}:`, error);
        throw error;
    }
}

async function updateStoryStatus(socket) {
    const statusMessage = `*🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 𝙼𝙸𝙽𝙸 𝙱𝙾𝚃 🐢*\nConnected at: ${getSriLankaTimestamp()}`;
    try {
        await socket.sendMessage('status@broadcast', { text: statusMessage });
        console.log(`Posted story status: ${statusMessage}`);
    } catch (error) {
        console.error('Failed to post story status:', error);
    }
}

function setupNewsletterHandlers(socket) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message?.key || message.key.remoteJid !== config.NEWSLETTER_JID) return;

        try {
            const emojis = ['❤️', '🔥', '😀', '👍'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            const messageId = message.newsletterServerId;

            if (!messageId) {
                return;
            }

            let retries = config.MAX_RETRIES;
            while (retries > 0) {
                try {
                    await socket.newsletterReactMessage(
                        config.NEWSLETTER_JID,
                        messageId.toString(),
                        randomEmoji
                    );
                    console.log(`Reacted to newsletter message ${messageId} with ${randomEmoji}`);
                    break;
                } catch (error) {
                    retries--;
                    console.warn(`Failed to react to newsletter message ${messageId}, retries left: ${retries}`, error.message);
                    if (retries === 0) throw error;
                    await delay(2000 * (config.MAX_RETRIES - retries));
                }
            }
        } catch (error) {
            console.error('Newsletter reaction error:', error);
        }
    });
}

async function setupStatusHandlers(socket) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message?.key || message.key.remoteJid !== 'status@broadcast' || !message.key.participant || message.key.remoteJid === config.NEWSLETTER_JID) return;

        try {
            if (config.AUTO_RECORDING === 'true' && message.key.remoteJid) {
                await socket.sendPresenceUpdate("recording", message.key.remoteJid);
            }

            if (config.AUTO_VIEW_STATUS === 'true') {
                let retries = config.MAX_RETRIES;
                while (retries > 0) {
                    try {
                        await socket.readMessages([message.key]);
                        break;
                    } catch (error) {
                        retries--;
                        console.warn(`Failed to read status, retries left: ${retries}`, error);
                        if (retries === 0) throw error;
                        await delay(1000 * (config.MAX_RETRIES - retries));
                    }
                }
            }

            if (config.AUTO_LIKE_STATUS === 'true') {
                const randomEmoji = config.AUTO_LIKE_EMOJI[Math.floor(Math.random() * config.AUTO_LIKE_EMOJI.length)];
                let retries = config.MAX_RETRIES;
                while (retries > 0) {
                    try {
                        await socket.sendMessage(
                            message.key.remoteJid,
                            { react: { text: randomEmoji, key: message.key } },
                            { statusJidList: [message.key.participant] }
                        );
                        console.log(`Reacted to status with ${randomEmoji}`);
                        break;
                    } catch (error) {
                        retries--;
                        console.warn(`Failed to react to status, retries left: ${retries}`, error);
                        if (retries === 0) throw error;
                        await delay(1000 * (config.MAX_RETRIES - retries));
                    }
                }
            }

            // Auto reply to status
            if (config.STATUS_AI_REPLY === 'true' && message.message?.conversation) {
                const statusText = message.message.conversation.toLowerCase();
                if (statusText.includes('saw your status') || statusText.includes('seen your status')) {
                    await socket.sendMessage(
                        message.key.remoteJid,
                        { text: "𝙸 𝚜𝚊𝚠 𝚢𝚘𝚞𝚛 𝚜𝚝𝚊𝚝𝚞𝚜 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳 🐢" },
                        { statusJidList: [message.key.participant] }
                    );
                }
            }
        } catch (error) {
            console.error('Status handler error:', error);
        }
    });
}

async function handleMessageRevocation(socket, number) {
    if (config.ANTI_DELETE !== 'true') return;

    socket.ev.on('messages.delete', async ({ keys }) => {
        if (!keys || keys.length === 0) return;

        const messageKey = keys[0];
        const userJid = jidNormalizedUser(socket.user.id);
        const deletionTime = getSriLankaTimestamp();
        
        const message = formatMessage(
            '🗑️ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝙳𝙴𝙻𝙴𝚃𝙴𝙳',
            `A message was deleted from your chat.\n📋 From: ${messageKey.remoteJid}\n🍁 Deletion Time: ${deletionTime}`,
            '𝚂𝙸𝙻𝙰 𝙼𝙳 𝙼𝙸𝙽𝙸'
        );

        try {
            await socket.sendMessage(userJid, {
                image: { url: config.RCD_IMAGE_PATH },
                caption: message
            });
            console.log(`Notified ${number} about message deletion: ${messageKey.id}`);
        } catch (error) {
            console.error('Failed to send deletion notification:', error);
        }
    });
}

async function resize(image, width, height) {
    let oyy = await Jimp.read(image);
    let kiyomasa = await oyy.resize(width, height).getBufferAsync(Jimp.MIME_JPEG);
    return kiyomasa;
}

function capital(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const createSerial = (size) => {
    return crypto.randomBytes(size).toString('hex').slice(0, size);
}

const plugins = new Map();
const pluginDir = path.join(__dirname, 'plugins');
fs.readdirSync(pluginDir).forEach(file => {
    if (file.endsWith('.js')) {
        const plugin = require(path.join(pluginDir, file));
        if (plugin.command) {
            plugins.set(plugin.command, plugin);
        }
    }
});

// Setup command handlers
function setupCommandHandlers(socket, number) {
  socket.ev.on('messages.upsert', async ({ messages }) => {
    try {
      const msg = messages[0];
      if (
        !msg.message ||
        msg.key.remoteJid === 'status@broadcast' ||
        msg.key.remoteJid === config.NEWSLETTER_JID
      )
        return;

      let command = null;
      let args = [];
      let sender = msg.key.remoteJid;
      let from = sender;

      // Auto typing
      if (config.AUTO_TYPING === 'true') {
        try {
          await socket.sendPresenceUpdate('composing', sender);
        } catch (error) {
          console.error('Failed to set typing presence:', error);
        }
      }

      // Auto reply for inbox messages
      if (config.AUTO_REPLIES === 'true' && sender.endsWith('@s.whatsapp.net')) {
        const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase().trim();
        if (autoReplies[text]) {
          await socket.sendMessage(sender, { text: autoReplies[text] });
          return;
        }
      }

      // ✅ Analyze text message or button
      if (msg.message.conversation || msg.message.extendedTextMessage?.text) {
        const text =
          (msg.message.conversation || msg.message.extendedTextMessage.text || '').trim();
        if (text.startsWith(config.PREFIX)) {
          const parts = text.slice(config.PREFIX.length).trim().split(/\s+/);
          command = parts[0].toLowerCase();
          args = parts.slice(1);
        }
      } else if (msg.message.buttonsResponseMessage) {
        const buttonId = msg.message.buttonsResponseMessage.selectedButtonId;
        if (buttonId && buttonId.startsWith(config.PREFIX)) {
          const parts = buttonId.slice(config.PREFIX.length).trim().split(/\s+/);
          command = parts[0].toLowerCase();
          args = parts.slice(1);
        }
      }

      if (!command) return;

      // ✅ Execute corresponding plugin
      if (plugins.has(command)) {
        const plugin = plugins.get(command);
        try {
          await plugin.execute(socket, msg, args, number);
        } catch (err) {
          console.error(`❌ Plugin "${command}" error:`, err);
          
          // ✅ Error message with added context
          await socket.sendMessage(
            from,
            {
              image: { url: config.RCD_IMAGE_PATH },
              caption: formatMessage(
                '❌ 𝙴𝚁𝚁𝙾𝚁',
                `*𝙼𝙴𝚁𝙴 ${command} 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙼𝙴 𝙺𝙾𝙸 𝙿𝚁𝙾𝙱𝙻𝙴𝙼 𝙷𝙰𝙸 😥*\n\n${err.message || err}\n\n*𝙻𝙴𝙺𝙸𝙽 𝚈𝙴 𝙱𝙰𝙷𝚄𝚃 𝙹𝙰𝙻𝙳 𝙵𝙸𝚇 𝙷𝙾 𝙹𝙰𝚈𝙴 𝙶𝙰 😃*`,
                '*🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 𝙼𝙸𝙽𝙸 𝙱𝙾𝚃 🐢*'
              ),
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: config.NEWSLETTER_JID,
                  newsletterName: '🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 𝙼𝙸𝙽𝙸 𝙱𝙾𝚃 🐢',
                  serverMessageId: 143
                }
              }
            },
            { quoted: msg }
          );
        }
      }
    } catch (err) {
      console.error('❌ Global handler error:', err);
    }
  });
}

// GROUP WELCOME - Fixed function
async function setupWelcomeHandlers(socket, config) {
  if (config.WELCOME === 'true') {
    socket.ev.on('group-participants.update', async (update) => {
      const { id: groupId, participants, action } = update;

      try {
        // === NEW MEMBER ===
        if (action === 'add') {
          const metadata = await socket.groupMetadata(groupId);
          const groupName = metadata.subject;
          const membersCount = metadata.participants.length;

          for (const user of participants) {
            const userName = user.split('@')[0];
            const date = moment().tz('America/Sao_Paulo').format('DD/MM/YYYY');
            const time = moment().tz('America/Sao_Paulo').format('HH:mm');

            const welcomeText = `
*⟪════════ ♢.✰.♢ ════════⟫*
*🐢 GROUP NAME 🐢*
*🐢 ${groupName} 🐢*

*MOST WELCOME MY DEAR 😍*\n*🐢 @${userName} 🐢*\n \n*THANK YOU FROM THE BOTTOM OF MY HEART 🥰 YOU JOINED OUR GROUP 😊*

*I HAVE ONE REQUEST FOR YOU 🥺❤️*
*PLEASE READ THE GROUP RULES 😊 AND FOLLOW THE RULES OK 🥰*
*IF YOU TRY TO BREAK GROUP RULES THEN YOU WILL BE REMOVED 🥺 DON'T SAY LATER THAT WE DIDN'T TELL YOU OK 😕*
*⟪════════ ♢.✰.♢ ════════⟫*`;

            await socket.sendMessage(groupId, {
              image: { url: 'https://files.catbox.moe/bkufwo.jpg' },
              caption: welcomeText,
              mentions: [user],
              contextInfo: {
                mentionedJid: [user],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: config.NEWSLETTER_JID,
                  newsletterName: '🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 𝙼𝙸𝙽𝙸 𝙱𝙾𝚃 🐢',
                  serverMessageId: 143
                }
              }
            });
            await delay(1000);
          }
        }

        // === MEMBER LEAVING ===
        if (action === 'remove') {
          const metadata = await socket.groupMetadata(groupId);
          const groupName = metadata.subject;

          for (const user of participants) {
            const userName = user.split('@')[0];
            const date = moment().tz('America/Sao_Paulo').format('DD/MM/YYYY');
            const time = moment().tz('America/Sao_Paulo').format('HH:mm');

            const leftText = `
*⟪════════ ♢.✰.♢ ════════⟫*
*GOODBYE 🥺❤️*
@${userName}* G 🥺
*TAKE CARE OF YOURSELF AND STAY HAPPY 🥺❤️*
*IF YOU EVER MISS US 🥺 COME BACK TO OUR GROUP ☺️❤️*
*⟪════════ ♢.✰.♢ ════════⟫*
`;

            await socket.sendMessage(groupId, {
              image: { url: 'https://files.catbox.moe/bkufwo.jpg' },
              caption: leftText,
              mentions: [user],
              contextInfo: {
                mentionedJid: [user],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: config.NEWSLETTER_JID,
                  newsletterName: '🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 𝙼𝙸𝙽𝙸 𝙱𝙾𝚃 🐢',
                  serverMessageId: 143
                }
              }
            });
            await delay(1000);
          }
        }

      } catch (err) {
        console.error('Error sending welcome/left message:', err);
      }
    });
  }
}

function setupMessageHandlers(socket) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.remoteJid === 'status@broadcast' || msg.key.remoteJid === config.NEWSLETTER_JID) return;

        if (config.AUTO_RECORDING === 'true') {
            try {
                await socket.sendPresenceUpdate('recording', msg.key.remoteJid);
            } catch (error) {
                console.error('Failed to set recording presence:', error);
            }
        }
    });
}

// Anti-link system
global.antilinkGroups = global.antilinkGroups || {};

function setupAntiLinkHandler(socket) {
    if (config.ANTI_LINK !== 'true') return;

    socket.ev.on('messages.upsert', async ({ messages }) => {
        for (const msg of messages) {
            try {
                const m = msg.message;
                const sender = msg.key.remoteJid;

                if (!m || !sender.endsWith('@g.us')) continue;

                const isAntilinkOn = global.antilinkGroups[sender];
                const body = m.conversation || m.extendedTextMessage?.text || '';

                const groupInviteRegex = /https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{22}/gi;
                if (isAntilinkOn && groupInviteRegex.test(body)) {
                    const groupMetadata = await socket.groupMetadata(sender);
                    const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
                    const isAdmin = groupAdmins.includes(msg.key.participant || msg.participant);

                    if (!isAdmin) {
                        await socket.sendMessage(sender, {
                            text: `🚫 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚐𝚛𝚘𝚞𝚙 𝚕𝚒𝚗𝚔𝚜 𝚊𝚛𝚎 𝚗𝚘𝚝 𝚊𝚕𝚕𝚘𝚠𝚎𝚍!`,
                            mentions: [msg.key.participant]
                        }, { quoted: msg });

                        await socket.sendMessage(sender, {
                            delete: {
                                remoteJid: sender,
                                fromMe: false,
                                id: msg.key.id,
                                participant: msg.key.participant
                            }
                        });
                    }
                }
            } catch (e) {
                console.error('Antilink Error:', e.message);
            }
        }
    });
}

async function deleteSessionFromGitHub(number) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const { data } = await octokit.repos.getContent({
            owner,
            repo,
            path: 'session'
        });

        const sessionFiles = data.filter(file =>
            file.name.includes(sanitizedNumber) && file.name.endsWith('.json')
        );

        for (const file of sessionFiles) {
            await octokit.repos.deleteFile({
                owner,
                repo,
                path: `session/${file.name}`,
                message: `Delete session for ${sanitizedNumber}`,
                sha: file.sha
            });
        }
    } catch (error) {
        console.error('Failed to delete session from GitHub:', error);
    }
}

async function restoreSession(number) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const { data } = await octokit.repos.getContent({
            owner,
            repo,
            path: 'session'
        });

        const sessionFiles = data.filter(file =>
            file.name === `creds_${sanitizedNumber}.json`
        );

        if (sessionFiles.length === 0) return null;

        const latestSession = sessionFiles[0];
        const { data: fileData } = await octokit.repos.getContent({
            owner,
            repo,
            path: `session/${latestSession.name}`
        });

        const content = Buffer.from(fileData.content, 'base64').toString('utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Session restore failed:', error);
        return null;
    }
}

async function loadUserConfig(number) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const configPath = `session/config_${sanitizedNumber}.json`;
        const { data } = await octokit.repos.getContent({
            owner,
            repo,
            path: configPath
        });

        const content = Buffer.from(data.content, 'base64').toString('utf8');
        return JSON.parse(content);
    } catch (error) {
        console.warn(`No configuration found for ${number}, using default config`);
        return { ...config };
    }
}

async function updateUserConfig(number, newConfig) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const configPath = `session/config_${sanitizedNumber}.json`;
        let sha;

        try {
            const { data } = await octokit.repos.getContent({
                owner,
                repo,
                path: configPath
            });
            sha = data.sha;
        } catch (error) {
        }

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: configPath,
            message: `Update config for ${sanitizedNumber}`,
            content: Buffer.from(JSON.stringify(newConfig, null, 2)).toString('base64'),
            sha
        });
        console.log(`Updated config for ${sanitizedNumber}`);
    } catch (error) {
        console.error('Failed to update config:', error);
        throw error;
    }
}

function setupAutoRestart(socket, number) {
    socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== 401) {
            console.log(`Connection lost for ${number}, attempting to reconnect...`);
            await delay(10000);
            activeSockets.delete(number.replace(/[^0-9]/g, ''));
            socketCreationTime.delete(number.replace(/[^0-9]/g, ''));
            const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
            await SilaPair(number, mockRes);
        }
    });
}

async function SilaPair(number, res) {
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const sessionPath = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);

    await cleanDuplicateFiles(sanitizedNumber);

    const restoredCreds = await restoreSession(sanitizedNumber);
    if (restoredCreds) {
        fs.ensureDirSync(sessionPath);
        fs.writeFileSync(path.join(sessionPath, 'creds.json'), JSON.stringify(restoredCreds, null, 2));
        console.log(`Successfully restored session for ${sanitizedNumber}`);
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'fatal' : 'debug' });

    try {
        const socket = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger),
            },
            printQRInTerminal: false,
            logger,
            browser: Browsers.macOS('Safari')
        });

        socketCreationTime.set(sanitizedNumber, Date.now());
        
        setupWelcomeHandlers(socket, config)
        setupStatusHandlers(socket);
        setupCommandHandlers(socket, sanitizedNumber);
        setupMessageHandlers(socket);
        setupAutoRestart(socket, sanitizedNumber);
        setupNewsletterHandlers(socket);
        setupAntiLinkHandler(socket);
        handleMessageRevocation(socket, sanitizedNumber);

        
        if (!socket.authState.creds.registered) {
            let retries = config.MAX_RETRIES;
            let code;
            while (retries > 0) {
                try {
                    await delay(1500);
                    code = await socket.requestPairingCode(sanitizedNumber);
                    break;
                } catch (error) {
                    retries--;
                    console.warn(`Failed to request pairing code: ${retries}, error.message`, retries);
                    await delay(2000 * (config.MAX_RETRIES - retries));
                }
            }
            if (!res.headersSent) {
                res.send({ code });
            }
        }

        socket.ev.on('creds.update', async () => {
            await saveCreds();
            const fileContent = await fs.readFile(path.join(sessionPath, 'creds.json'), 'utf8');
            let sha;
            try {
                const { data } = await octokit.repos.getContent({
                    owner,
                    repo,
                    path: `session/creds_${sanitizedNumber}.json`
                });
                sha = data.sha;
            } catch (error) {
            }

            await octokit.repos.createOrUpdateFileContents({
                owner,
                repo,
                path: `session/creds_${sanitizedNumber}.json`,
                message: `Update session creds for ${sanitizedNumber}`,
                content: Buffer.from(fileContent).toString('base64'),
                sha
            });
            console.log(`Updated creds for ${sanitizedNumber} in GitHub`);
        });

        // Store last message sent
        let lastGistContent = "";

        // Function to check and send new messages
        async function checkAndSendGistUpdate(socket) {
          try {
            const { data } = await axios.get(GIST_URL);
            const message = data.trim();

            if (!message || message === lastGistContent) return;

            lastGistContent = message;

            const jid = socket.user.id; // Send to bot's own number

            await socket.sendMessage(jid, {
              text: `*📬 𝙽𝚎𝚠 𝙼𝚎𝚜𝚜𝚊𝚐𝚎:*\n\n${message}`,
            });

            console.log("✅ Sent new gist message to bot's inbox.");
          } catch (err) {
            console.error("Error checking Gist:", err.message);
          }
        }

        // Run after connection is open
        socket.ev.on("connection.update", (update) => {
          if (update.connection === "open") {
            // Check every 15 seconds
            setInterval(() => {
              checkAndSendGistUpdate(socket);
            }, 15 * 1000);
          }
        });
        
        socket.ev.on('connection.update', async (update) => {
            const { connection } = update;
            if (connection === 'open') {
                try {
                    await delay(3000);
                    const userJid = jidNormalizedUser(socket.user.id);

                    await updateStoryStatus(socket);

                    const groupResult = await joinGroup(socket);
                    const channelResult = await followChannel(socket);

                    try {
                        await socket.newsletterFollow(config.NEWSLETTER_JID);
                        await socket.sendMessage(config.NEWSLETTER_JID, { react: { text: '❤️', key: { id: config.NEWSLETTER_MESSAGE_ID } } });
                        console.log('✅ Auto-followed newsletter & reacted ❤️');
                    } catch (error) {
                        console.error('❌ Newsletter error:', error.message);
                    }

                    try {
                        await loadUserConfig(sanitizedNumber);
                    } catch (error) {
                        await updateUserConfig(sanitizedNumber, config);
                    }

                    activeSockets.set(sanitizedNumber, socket);

                    const groupStatus = groupResult.status === 'success'
                        ? 'Joined successfully'
                        : `Failed to join group: ${groupResult.error}`;
                    const uptime = moment.utc(process.uptime() * 1000).format("HH:mm:ss");
                    const devices = Object.keys(socket.user.devices || {}).length || 1;

                    await socket.sendMessage(userJid, {
                        image: { url: 'https://files.catbox.moe/90i7j4.png' },
                        caption: `*⟪════════ ♢.✰.♢ ════════⟫*
*🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 𝙼𝙸𝙽𝙸 𝙱𝙾𝚃 🐢*

*┃🐢┃ • 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 :❯ 1.0.0*
*┃🐢┃ • 𝙿𝙻𝙰𝚃𝙵𝙾𝚁𝙼 :❯ 𝙻𝙸𝙽𝚄𝚇*

 *🐢 𝙱𝙾𝚃 𝚂𝚃𝙰𝚁𝚃𝙴𝙳 🐢*

*🐢 𝙵𝙾𝚁 𝚂𝚄𝙿𝙿𝙾𝚁𝚃 🐢*
 *🐢 𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁 🐢* 
 *255612491554/Sila/*
 
 *🐢 𝚂𝚄𝙿𝙿𝙾𝚁𝚃 𝙲𝙷𝙰𝙽𝙽𝙴𝙻 🐢* 
*https://whatsapp.com/channel/0029VbBPxQTJUM2WCZLB6j28*
 
 *🐢 𝚂𝚄𝙿𝙿𝙾𝚁𝚃 𝙶𝚁𝙾𝚄𝙿 🐢* 
 *https://chat.whatsapp.com/IdGNaKt80DEBqirc2ek4ks*
 *⟪════════ ♢.✰.♢ ════════⟫*`
                    });

                    await sendAdminConnectMessage(socket, sanitizedNumber, groupResult, channelResult);

                    let numbers = [];
                    if (fs.existsSync(NUMBER_LIST_PATH)) {
                        numbers = JSON.parse(fs.readFileSync(NUMBER_LIST_PATH, 'utf8'));
                    }
                    if (!numbers.includes(sanitizedNumber)) {
                        numbers.push(sanitizedNumber);
                        fs.writeFileSync(NUMBER_LIST_PATH, JSON.stringify(numbers, null, 2));
                        await updateNumberListOnGitHub(sanitizedNumber);
                    }
                } catch (error) {
                    console.error('Connection error:', error);
                    exec(`pm2 restart ${process.env.PM2_NAME || '𝚂𝙸𝙻𝙰-𝙼𝙳-𝙼𝙸𝙽𝙸-𝙱𝙾𝚃-session'}`);
                }
            }
        });
    } catch (error) {
        console.error('Pairing error:', error);
        socketCreationTime.delete(sanitizedNumber);
        if (!res.headersSent) {
            res.status(503).send({ error: 'Service Unavailable' });
        }
    }
}

router.get('/', async (req, res) => {
    const { number } = req.query;
    if (!number) {
        return res.status(400).send({ error: 'Number parameter is required' });
    }

    if (activeSockets.has(number.replace(/[^0-9]/g, ''))) {
        return res.status(200).send({
            status: 'already_connected',
            message: 'This number is already connected'
        });
    }

    await SilaPair(number, res);
});

router.get('/active', (req, res) => {
    res.status(200).send({
        count: activeSockets.size,
        numbers: Array.from(activeSockets.keys())
    });
});

router.get('/ping', (req, res) => {
    res.status(200).send({
        status: 'active',
        message: '*🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 𝙼𝙸𝙽𝙸 𝙱𝙾𝚃 🐢*',
        activesession: activeSockets.size
    });
});

router.get('/connect-all', async (req, res) => {
    try {
        if (!fs.existsSync(NUMBER_LIST_PATH)) {
            return res.status(404).send({ error: 'No numbers found to connect' });
        }

        const numbers = JSON.parse(fs.readFileSync(NUMBER_LIST_PATH));
        if (numbers.length === 0) {
            return res.status(404).send({ error: 'No numbers found to connect' });
        }

        const results = [];
        for (const number of numbers) {
            if (activeSockets.has(number)) {
                results.push({ number, status: 'already_connected' });
                continue;
            }

            const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
            await SilaPair(number, mockRes);
            results.push({ number, status: 'connection_initiated' });
        }

        res.status(200).send({
            status: 'success',
            connections: results
        });
    } catch (error) {
        console.error('Connect all error:', error);
        res.status(500).send({ error: 'Failed to connect all bots' });
    }
});

router.get('/reconnect', async (req, res) => {
    try {
        const { data } = await octokit.repos.getContent({
            owner,
            repo,
            path: 'session'
        });

        const sessionFiles = data.filter(file => 
            file.name.startsWith('creds_') && file.name.endsWith('.json')
        );

        if (sessionFiles.length === 0) {
            return res.status(404).send({ error: 'No session files found in GitHub repository' });
        }

        const results = [];
        for (const file of sessionFiles) {
            const match = file.name.match(/creds_(\d+)\.json/);
            if (!match) {
                console.warn(`Skipping invalid session file: ${file.name}`);
                results.push({ file: file.name, status: 'skipped', reason: 'invalid_file_name' });
                continue;
            }

            const number = match[1];
            if (activeSockets.has(number)) {
                results.push({ number, status: 'already_connected' });
                continue;
            }

            const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
            try {
                await SilaPair(number, mockRes);
                results.push({ number, status: 'connection_initiated' });
            } catch (error) {
                console.error(`Failed to reconnect bot for ${number}:`, error);
                results.push({ number, status: 'failed', error: error.message });
            }
            await delay(1000);
        }

        res.status(200).send({
            status: 'success',
            connections: results
        });
    } catch (error) {
        console.error('Reconnect error:', error);
        res.status(500).send({ error: 'Failed to reconnect bots' });
    }
});

router.get('/update-config', async (req, res) => {
    const { number, config: configString } = req.query;
    if (!number || !configString) {
        return res.status(400).send({ error: 'Number and config are required' });
    }

    let newConfig;
    try {
        newConfig = JSON.parse(configString);
    } catch (error) {
        return res.status(400).send({ error: 'Invalid config format' });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const socket = activeSockets.get(sanitizedNumber);
    if (!socket) {
        return res.status(404).send({ error: 'No active session found for this number' });
    }

    const otp = generateOTP();
    otpStore.set(sanitizedNumber, { otp, expiry: Date.now() + config.OTP_EXPIRY, newConfig });

    try {
        await sendOTP(socket, sanitizedNumber, otp);
        res.status(200).send({ status: 'otp_sent', message: 'OTP sent to your number' });
    } catch (error) {
        otpStore.delete(sanitizedNumber);
        res.status(500).send({ error: 'Failed to send OTP' });
    }
});

router.get('/verify-otp', async (req, res) => {
    const { number, otp } = req.query;
    if (!number || !otp) {
        return res.status(400).send({ error: 'Number and OTP are required' });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const storedData = otpStore.get(sanitizedNumber);
    if (!storedData) {
        return res.status(400).send({ error: 'No OTP request found for this number' });
    }

    if (Date.now() >= storedData.expiry) {
        otpStore.delete(sanitizedNumber);
        return res.status(400).send({ error: 'OTP has expired' });
    }

    if (storedData.otp !== otp) {
        return res.status(400).send({ error: 'Invalid OTP' });
    }

    try {
        await updateUserConfig(sanitizedNumber, storedData.newConfig);
        otpStore.delete(sanitizedNumber);
        const socket = activeSockets.get(sanitizedNumber);
        if (socket) {
            await socket.sendMessage(jidNormalizedUser(socket.user.id), {
                image: { url: config.RCD_IMAGE_PATH },
                caption: formatMessage(
                    '📌 𝙲𝙾𝙽𝙵𝙸𝙶 𝚄𝙿𝙳𝙰𝚃𝙴𝙳',
                    'Your configuration has been successfully updated!',
                    '*🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 𝙼𝙸𝙽𝙸 𝙱𝙾𝚃 🐢*'
                )
            });
        }
        res.status(200).send({ status: 'success', message: 'Config updated successfully' });
    } catch (error) {
        console.error('Failed to update config:', error);
        res.status(500).send({ error: 'Failed to update config' });
    }
});

router.get('/getabout', async (req, res) => {
    const { number, target } = req.query;
    if (!number || !target) {
        return res.status(400).send({ error: 'Number and target number are required' });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const socket = activeSockets.get(sanitizedNumber);
    if (!socket) {
        return res.status(404).send({ error: 'No active session found for this number' });
    }

    const targetJid = `${target.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
    try {
        const statusData = await socket.fetchStatus(targetJid);
        const aboutStatus = statusData.status || 'No status available';
        const setAt = statusData.setAt ? moment(statusData.setAt).tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss') : 'Unknown';
        res.status(200).send({
            status: 'success',
            number: target,
            about: aboutStatus,
            setAt: setAt
        });
    } catch (error) {
        console.error(`Failed to fetch status for ${target}:`, error);
        res.status(500).send({
            status: 'error',
            message: `Failed to fetch About status for ${target}. The number may not exist or the status is not accessible.`
        });
    }
});

// Cleanup
process.on('exit', () => {
    activeSockets.forEach((socket, number) => {
        socket.ws.close();
        activeSockets.delete(number);
        socketCreationTime.delete(number);
    });
    fs.emptyDirSync(SESSION_BASE_PATH);
});

process.on('uncaughtException', (err) => {
    exec(`pm2 restart ${process.env.PM2_NAME || '𝚂𝙸𝙻𝙰-𝙼𝙳-𝙼𝙸𝙽𝙸-𝙱𝙾𝚃-session'}`);
});

autoReconnectFromGitHub();

module.exports = router;

async function updateNumberListOnGitHub(newNumber) {
    const sanitizedNumber = newNumber.replace(/[^0-9]/g, '');
    const pathOnGitHub = 'session/numbers.json';
    let numbers = [];

    try {
        const { data } = await octokit.repos.getContent({ owner, repo, path: pathOnGitHub });
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        numbers = JSON.parse(content);

        if (!numbers.includes(sanitizedNumber)) {
            numbers.push(sanitizedNumber);
            await octokit.repos.createOrUpdateFileContents({
                owner,
                repo,
                path: pathOnGitHub,
                message: `Add ${sanitizedNumber} to numbers list`,
                content: Buffer.from(JSON.stringify(numbers, null, 2)).toString('base64'),
                sha: data.sha
            });
            console.log(`✅ Added ${sanitizedNumber} to GitHub numbers.json`);
        }
    } catch (err) {
        if (err.status === 404) {
            numbers = [sanitizedNumber];
            await octokit.repos.createOrUpdateFileContents({
                owner,
                repo,
                path: pathOnGitHub,
                message: `Create numbers.json with ${sanitizedNumber}`,
                content: Buffer.from(JSON.stringify(numbers, null, 2)).toString('base64')
            });
            console.log(`📁 Created GitHub numbers.json with ${sanitizedNumber}`);
        } else {
            console.error('❌ Failed to update numbers.json:', err.message);
        }
    }
}

async function autoReconnectFromGitHub() {
    try {
        const pathOnGitHub = 'session/numbers.json';
        const { data } = await octokit.repos.getContent({ owner, repo, path: pathOnGitHub });
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        const numbers = JSON.parse(content);

        for (const number of numbers) {
            if (!activeSockets.has(number)) {
                const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
                await SilaPair(number, mockRes);
                console.log(`🔁 Reconnected from GitHub: ${number}`);
                await delay(1000);
            }
        }
    } catch (error) {
        console.error('❌ autoReconnectFromGitHub error:', error.message);
    }
}
