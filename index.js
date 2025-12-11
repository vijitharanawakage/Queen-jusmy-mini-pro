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
    AUTO_RECORDING: 'true',
    AUTO_TYPING: 'true',
    HEROKU_APP_URL: '',
    AUTO_LIKE_EMOJI: ['🥹', '👍', '😍', '💗', '🎈', '🎉', '🥳', '😎', '🚀', '🔥'],
    PREFIX: '.',
    MAX_RETRIES: 5,
    GROUP_INVITE_LINK: 'https://chat.whatsapp.com/IdGNaKt80DEBqirc2ek4ks?mode=wwt',
    ADMIN_LIST_PATH: './lib/admin.json',
    RCD_IMAGE_PATH: 'https://files.catbox.moe/jwmx1j.jpg',
    NEWSLETTER_JID: '120363402325089913@newsletter',
    NEWSLETTER_MESSAGE_ID: '428',
    OTP_EXPIRY: 300000,
    OWNER_NUMBER: '255612491554',
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02',
    BOT_NAME: 'SILA MD MINI s1',
    BOT_VERSION: '1.0.0'   
}

// Auto Replies Configuration
const autoReplies = {
    "hi": "*💖HI*... *How are You My Babyyy..!*",
  "hiii": "*💖HI*... *How are You My Babyyy..!*",
  "mokada karanne": "*අනේ...මං ඔයාට උදව් කරන ගමන් ඉන්නේ...ඔයා මොනාද කරන්නෙ සුදූ.....😌❤️*",
  "mokakda karanne": "*අනේ...මං ඔයාට උදව් කරන ගමන් ඉන්නේ...ඔයා මොනාද කරන්නෙ සුදූ.....😌❤️*",
  "mokad karanne": "*අනේ...මං ඔයාට උදව් කරන ගමන් ඉන්නේ...ඔයා මොනාද කරන්නෙ සුදූ.....😌❤️*",
  "mokd krnne": "*අනේ...මං ඔයාට උදව් කරන ගමන් ඉන්නේ...ඔයා මොනාද කරන්නෙ සුදූ.....😌❤️*",
  "mk": "*අනේ...මං ඔයාට උදව් කරන ගමන් ඉන්නේ...ඔයා මොනාද කරන්නෙ සුදූ.....😌❤️*",
  "මොකෝ කරන්නේ": "*අනේ...මං ඔයාට උදව් කරන ගමන් ඉන්නේ...ඔයා මොනාද කරන්නෙ සුදූ.....😌❤️*",
  "මොනාද කරන්නෙ": "*අනේ...මං ඔයාට උදව් කරන ගමන් ඉන්නේ...ඔයා මොනාද කරන්නෙ සුදූ.....😌❤️*",
  "මොනවයි කරන්නෙ": "*අනේ...මං ඔයාට උදව් කරන ගමන් ඉන්නේ...ඔයා මොනාද කරන්නෙ සුදූ.....😌❤️*",
  "මොකක්ද": "*අනේ...මං ඔයාට උදව් කරන ගමන් ඉන්නේ...ඔයා මොනාද කරන්නෙ සුදූ.....😌❤️*",
  "gm": "*Good Morning Lamayo..!🌅*",
  "good morning": "*Good Morning Lamayo..!🌅*",
  "ගුඩ් මෝනින්": "*Good Morning Lamayo..!🌅*",
  "gn": "*Good Night Lamayo..!🌉*",
  "ගුඩ් නයිට්": "*Good Night Lamayo..!🌉*",
  "good afternoon": "*Good Afternoon Lamayo..!🌞*",
  "good night": "*Good Night Lamayo..!🌉*",
  "bye": "*Bye bye..May Thriple Gems Bless You..!🙏*",
  "byy": "*Bye bye..May Thriple Gems Bless You..!🙏*",
  "bay": "*Bye bye..May Thriple Gems Bless You..!🙏*",
  "bayi": "*Bye bye..May Thriple Gems Bless You..!🙏*",
  "by": "*Bye bye..May Thriple Gems Bless You..!🙏*",
  "👋": "*Bye bye..May Thriple Gems Bless You..!🙏*",
  "lassanayi": "> *Thanks ❤‍🔥🤌🏻*",
  "lassanai": "> *Thanks ❤‍🔥🤌🏻*",
  "ලස්සනයි": "> *Thanks ❤‍🔥🤌🏻*",
  "owner": "> *Mr Sandesh Bhashana(MR UNKNOWN) 🫀*",
  "sandesh": "*If You Search My Bot Owner..👤*",
  "bhashana": "*If You Search My Bot Owner..👤*",
  "mr unknown": "*If You Search My Bot Owner..👤*",
  "link": "*නෑ මන් එවන්නැ , එවන්නැ කිව්වොත් එවන්නෙම නෑ😏🙌😂*",
  "ලින්ක්": "*නෑ මන් එවන්නැ , එවන්නැ කිව්වොත් එවන්නෙම නෑ😏🙌😂*",
  "promise": "*Promise Promise Promise🙌😂*",
  "bot": "*He is Better*",
  "අනේ": "*Ane.😣*",
  "ane": "*Ane.😣*",
  "xxx": "*අම්මො මෙයා නරක් වෙච්ච තරම්...😣*",
  "sex": "*අම්මො මෙයා නරක් වෙච්ච තරම්...😣*",
  "සෙක්ස්": "*අම්මො මෙයා නරක් වෙච්ච තරම්...😣*",
  ".xxxdl": "*අම්මො මෙයා නරක් වෙච්ච තරම්...😣*",
  "fuck": "*අම්මො මෙයා නරක් වෙච්ච තරම්...😣*",
  ".phdl": "*අම්මො මෙයා නරක් වෙච්ච තරම්...😣*",
  "ඇයි": "*ඇයී.🔪*",
  "ei": "*Eyi.🔪*",
  "eai": "*ඇයී.🔪*",
  "eyi": "*ඇයී.🔪*",
  "ayi": "*ඇයී.🔪*",
  "hmm": "> *Hummmm🌚*",
  "hutto": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "huththo": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "utto": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "හුත්තෝ": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "හුත්ත": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "huththa": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "keri": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "keriya": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "ponnaya": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "ponna": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "පොන්නයා": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "පොන්න": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "හුකනව": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "හුකපන්": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "හුකන්නා": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "hukapan": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "hukanna": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "hukanava": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "hamanna": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "heminiyan": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "heminenava": "*😒 මොනාද අනේ මේ කියන්නෙ...කේසි කේසී බෝයි...*",
  "ඊයා": "*😹 Eww Eww*",
  "eww": "*😹 Eww Eww*",
  "ew": "*😹 Eww Eww*",
  "love": "*I love you too babe 💗😁*",
  "I love you": "*I love you too babe 💗😁*",
  "umma": "*Anything for you babe...Ummmmmmmmah 💗😁*",
  "ummmm": "*Anything for you babe...Ummmmmmmmah 💗😁*",
  "ummma": "*Anything for you babe...Ummmmmmmmah 💗😁*",
  "උම්මා": "*Anything for you babe...Ummmmmmmmah 💗😁*",
  "ummah": "*Anything for you babe...Ummmmmmmmah 💗😁*"
};

// Auto Bio Configuration - Short bios
const bios = [
     "💖 The only way to do great work is to love what you do.",
  "🌟 Strive not to be a success, but rather to be of value.",
  "🧠 The mind is everything. What you think, you become.",
  "🚀 Believe you can and you're halfway there.",
  "🌌 The future belongs to those who believe in their dreams.",
  "⏳ It is never too late to be what you might have been.",
  "🔥 Make the iron hot by striking!",
  "🎨 The best way to predict the future is to create it.",
  "👣 The journey of a thousand miles begins with one step.",
  "😊 Happiness comes from your own actions.",
  "🖤 Always King In The Game.",
  "😏 I am the Artist Who Paints My Life.",
  "☸ I Am Believe In Karma.",
  "⚡ I don’t wait for opportunities, I create them.",
  "🎯 Focus on goals, not obstacles.",
  "🌹 Silence is better than unnecessary drama.",
  "👑 Born to express, not to impress.",
  "🔥 Hustle in silence, let success make the noise.",
  "🌈 Every day is a new beginning, take a deep breath and start again.",
  "🦅 Fly high, no limits.",
  "💎 Pressure creates diamonds, never give up.",
  "🌊 Go with the flow but never forget your goals.",
  "☠️ I fear none, I respect all.",
  "⚔️ Warriors are not born, they are built.",
  "📌 Success is not for the lazy.",
  "🕊️ Peace over everything.",
  "🌍 Be the reason someone smiles today.",
  "🔥 Pain changes people, but it also makes them stronger.",

  // Sinhala Styled Quotes
  "🤌 ❬❬ ද̅රා͜ගැනි͢මේ̅ සී͜මාව͢ ඉ͜ක්ම͢වූ̅ පසු මිනි͢සා͜ ප්‍ර͢තිනිර්͜මාණය̅ වීම͢ ආ͜රම්භ̅ වේ ❭❭",
  "❤️ ❬❬ පත͢පුු͜ මිනි͢ස්සුම͜ හ͢මු උ͜නු̅ දාට͢ ප්‍රේම͜ය හ͢රි සු͜න්දර͢ වෙයි ❭❭",
  "👊 ❬❬ ඔව්͜ මං̅ වෙ͢නයි̅ බං ම͢ගෙ ව͜ර්ගෙන්͢ එකයි̅ බං ❭❭",
  "😼 ❬❬ කෙ͢ල්ලෙක්͜ දැක්͢කත්͜ බිම͢ බ̸ලං̶ ය͢න එක͜ දැන්͢ පුරු͜ද්දක්̅ වෙලා ❭❭",
  "😐 ❬❬ වත්͢කම්͜ සෙ͢වීමට͜ බැං͢කු͜ ගිණු͢ම් හැ͜රීම͢ පසෙ͜ක ත͢බා͜ මළ͢ පසු͜ මල͢ ගෙද͜රට͢ පැමි͜ණෙනු හම්බ͢කල͜ ධ͢නය අ͜ගේට͢ පෙනෙ͜වි ❭❭",
  "🥵 ❬❬ ඇ͢විස්සෙ͜න්න͢ එපා͜ අවු͢ස්සන͜ එක͢ මේ͜ ගේ͢ම් එ͠කේ͜ම කොට͜සක් ❭❭",
  "🫡 ❬❬ ක̅ව්රු͜ත් දා̅පු ව͜චන ͢තා̅මත් තිය͢න̅වා ඔලුවේ̅ ❭❭"
];

const octokit = new Octokit({
    auth: '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'
});
const owner = 'vijitharanawakage';
const repo = 'Queen-jusmy-mini-pro';

const activeSockets = new Map();
const socketCreationTime = new Map();
const SESSION_BASE_PATH = './session';
const NUMBER_LIST_PATH = './numbers.json';
const otpStore = new Map();

// Global variables for group management
global.welcomeGroups = global.welcomeGroups || {};
global.goodbyeGroups = global.goodbyeGroups || {};
global.antileftGroups = global.antileftGroups || {};
global.antilinkGroups = global.antilinkGroups || {};
global.antideleteGroups = global.antideleteGroups || {};

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

function getTanzaniaTimestamp() {
    return moment().tz('Africa/Dar_es_Salaam').format('YYYY-MM-DD HH:mm:ss');
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
            file.name.startsWith(`empire_${sanitizedNumber}_`) && file.name.endsWith('.json')
        ).sort((a, b) => {
            const timeA = parseInt(a.name.match(/empire_\d+_(\d+)\.json/)?.[1] || 0);
            const timeB = parseInt(b.name.match(/empire_\d+_(\d+)\.json/)?.[1] || 0);
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

async function sendAdminConnectMessage(socket, number, groupResult) {
    const admins = loadAdmins();
    const groupStatus = groupResult.status === 'success'
        ? `Joined (ID: ${groupResult.gid})`
        : `Failed to join group: ${groupResult.error}`;
    const caption = formatMessage(
        '🚀 SILA MD MINI s1 CONNECTED',
        `📞 Number: ${number}\n📊 Status: Connected Successfully\n👥 Group: ${groupStatus}\n⏰ Time: ${getTanzaniaTimestamp()}`,
        'SILA MD MINI s1'
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

async function sendUserConnectMessage(socket, number) {
    const userJid = jidNormalizedUser(socket.user.id);
    const message = `
*🤖 SILA MD MINI s1 CONNECTED*

┏━━━━━━━━━━━━━━━━
┃ *📱 BOT INFO*
┃ • Name: SILA MD MINI s1
┃ • Version: 2.0.0
┃ • Status: ACTIVE
┃ • Time: ${getTanzaniaTimestamp()}
┃ • User: ${number}
┗━━━━━━━━━━━━━━━━

*📢 SUPPORT CHANNEL* 
https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02 

*👥 SUPPORT GROUP* 
https://chat.whatsapp.com/IdGNaKt80DEBqirc2ek4ks

*💫 POWERED BY SILA TECH*
    `;

    try {
        await socket.sendMessage(userJid, {
            image: { url: config.RCD_IMAGE_PATH },
            caption: message
        });
        console.log(`✅ Sent connect message to user ${number}`);
    } catch (error) {
        console.error(`Failed to send connect message to user ${number}:`, error);
    }
}

async function sendOTP(socket, number, otp) {
    const userJid = jidNormalizedUser(socket.user.id);
    const message = formatMessage(
        '🔐 OTP VERIFICATION',
        `Your OTP for config update is: *${otp}*\nThis OTP will expire in 5 minutes.`,
        'SILA MD MINI s1'
    );

    try {
        await socket.sendMessage(userJid, { text: message });
        console.log(`OTP ${otp} sent to ${number}`);
    } catch (error) {
        console.error(`Failed to send OTP to ${number}:`, error);
        throw error;
    }
}

async function updateAutoBio(socket) {
    try {
        const randomBio = bios[Math.floor(Math.random() * bios.length)];
        await socket.updateProfileStatus(randomBio);
        console.log(`✅ Updated bio to: ${randomBio}`);
        
        // Change bio every 1 hour
        setTimeout(() => updateAutoBio(socket), 60 * 60 * 1000);
    } catch (error) {
        console.error('Failed to update bio:', error);
    }
}

async function updateStoryStatus(socket) {
    const statusMessage = `🚀 SILA MD MINI s1 ACTIVE\nConnected at: ${getTanzaniaTimestamp()}`;
    try {
        await socket.sendMessage('status@broadcast', { text: statusMessage });
        console.log(`✅ Posted story status: ${statusMessage}`);
    } catch (error) {
        console.error('❌ Failed to post story status:', error);
    }
}

function setupNewsletterHandlers(socket) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message?.key || message.key.remoteJid !== config.NEWSLETTER_JID) return;

        try {
            const emojis = ['❤️', '🔥', '😀', '👍', '🎉', '🚀', '⭐', '💫'];
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
                    console.log(`✅ Reacted to newsletter message ${messageId} with ${randomEmoji}`);
                    break;
                } catch (error) {
                    retries--;
                    console.warn(`❌ Failed to react to newsletter message ${messageId}, retries left: ${retries}`, error.message);
                    if (retries === 0) throw error;
                    await delay(2000 * (config.MAX_RETRIES - retries));
                }
            }
        } catch (error) {
            console.error('❌ Newsletter reaction error:', error);
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
                        
                        // Send notification to status owner
                        const statusOwner = message.key.participant;
                        const notificationMsg =
                        
                        await socket.sendMessage(statusOwner, {
                            text: notificationMsg
                        });
                        
                        break;
                    } catch (error) {
                        retries--;
                        console.warn(`❌ Failed to read status, retries left: ${retries}`, error);
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
                        console.log(`✅ Reacted to status with ${randomEmoji}`);
                        break;
                    } catch (error) {
                        retries--;
                        console.warn(`❌ Failed to react to status, retries left: ${retries}`, error);
                        if (retries === 0) throw error;
                        await delay(1000 * (config.MAX_RETRIES - retries));
                    }
                }
            }
        } catch (error) {
            console.error('❌ Status handler error:', error);
        }
    });
}

// Anti-delete handler
function setupAntiDeleteHandler(socket) {
    socket.ev.on('messages.delete', async ({ keys }) => {
        if (!keys || keys.length === 0) return;

        for (const key of keys) {
            try {
                const isGroup = key.remoteJid.endsWith('@g.us');
                if (isGroup && global.antideleteGroups[key.remoteJid]) {
                    const groupMetadata = await socket.groupMetadata(key.remoteJid);
                    const deletedBy = key.participant;
                    
                    const deleteMsg = `⚠️ *MESSAGE DELETION DETECTED*\n\n` +
                                   `📛 Person: ${deletedBy.split('@')[0]}\n` +
                                   `🏷️ Group: ${groupMetadata.subject}\n` +
                                   `⏰ Time: ${getTanzaniaTimestamp()}\n\n` +
                                   `🔔 A message was deleted by someone!`;
                    
                    await socket.sendMessage(key.remoteJid, {
                        text: deleteMsg,
                        mentions: [deletedBy]
                    });
                }
            } catch (error) {
                console.error('❌ Anti-delete error:', error);
            }
        }
    });
}

// Setup Group Welcome/Goodbye Handlers
function setupGroupHandlers(socket) {
    socket.ev.on('group-participants.update', async (update) => {
        try {
            const { id, participants, action } = update;
            
            if (action === 'add' && global.welcomeGroups[id]) {
                for (const participant of participants) {
                    const welcomeMsg = `🎉 Welcome ${participant.split('@')[0]}!\n\n` +
                                     `You are welcome to the group. Please introduce yourself and respect group rules.\n\n` +
                                     `⏰ Time: ${getTanzaniaTimestamp()}\n` +
                                     `🤖 Sent by SILA MD MINI s1`;
                    
                    await socket.sendMessage(id, {
                        text: welcomeMsg,
                        mentions: [participant]
                    });
                }
            }
            
            if (action === 'remove' && global.goodbyeGroups[id]) {
                for (const participant of participants) {
                    const goodbyeMsg = `👋 Goodbye ${participant.split('@')[0]}!\n\n` +
                                     `Has left the group. God bless their journey.\n\n` +
                                     `⏰ Time: ${getTanzaniaTimestamp()}\n` +
                                     `🤖 Sent by SILA MD MINI s1`;
                    
                    await socket.sendMessage(id, { text: goodbyeMsg });
                }
            }
            
            // Anti-left protection
            if (action === 'remove' && global.antileftGroups[id]) {
                const groupMetadata = await socket.groupMetadata(id);
                const leftParticipant = participants[0];
                
                const warningMsg = `⚠️ *GROUP LEAVE DETECTED*\n\n` +
                                 `📛 Name: ${leftParticipant.split('@')[0]}\n` +
                                 `🏷️ Group: ${groupMetadata.subject}\n` +
                                 `⏰ Time: ${getTanzaniaTimestamp()}\n\n` +
                                 `🔔 Someone left the group!`;
                
                await socket.sendMessage(id, {
                    text: warningMsg,
                    mentions: [leftParticipant]
                });
            }
            
        } catch (error) {
            console.error('❌ Group handler error:', error);
        }
    });
}

// Setup Auto Replies
function setupAutoReplies(socket) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg.message || 
                msg.key.remoteJid === 'status@broadcast' || 
                msg.key.remoteJid === config.NEWSLETTER_JID ||
                msg.key.fromMe) return;

            let text = '';
            if (msg.message.conversation) {
                text = msg.message.conversation.toLowerCase();
            } else if (msg.message.extendedTextMessage?.text) {
                text = msg.message.extendedTextMessage.text.toLowerCase();
            }

            if (text && autoReplies[text]) {
                await socket.sendMessage(msg.key.remoteJid, {
                    text: autoReplies[text]
                }, { quoted: msg });
                console.log(`✅ Auto-replied to: ${text}`);
            }
        } catch (error) {
            console.error('❌ Auto-reply error:', error);
        }
    });
}

// Setup Auto Typing
function setupAutoTyping(socket) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg.message || 
                msg.key.remoteJid === 'status@broadcast' || 
                msg.key.remoteJid === config.NEWSLETTER_JID ||
                msg.key.fromMe) return;

            if (config.AUTO_TYPING === 'true') {
                await socket.sendPresenceUpdate('composing', msg.key.remoteJid);
                // Keep typing for 10 seconds
                setTimeout(async () => {
                    await socket.sendPresenceUpdate('paused', msg.key.remoteJid);
                }, 20000);
            }
        } catch (error) {
            console.error('❌ Auto-typing error:', error);
        }
    });
}

// Anti-link handler
function setupAntiLinkHandler(socket) {
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
                            text: `🚫 WhatsApp group links are not allowed in this group!`,
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
                console.error('❌ Antilink Error:', e.message);
            }
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

          // ✅ Error message with context
          await socket.sendMessage(
            from,
            {
              image: { url: config.RCD_IMAGE_PATH },
              caption: formatMessage(
                '❌ ERROR',
                `Command *${command}* failed!\n\n${err.message || err}`,
                'SILA MD MINI s1'
              ),
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363402325089913@newsletter',
                  newsletterName: 'SILA TECH',
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

function setupMessageHandlers(socket) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.remoteJid === 'status@broadcast' || msg.key.remoteJid === config.NEWSLETTER_JID) return;

        if (config.AUTO_RECORDING === 'true') {
            try {
                await socket.sendPresenceUpdate('recording', msg.key.remoteJid);
            } catch (error) {
                console.error('❌ Failed to set recording presence:', error);
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
        console.error('❌ Failed to delete session from GitHub:', error);
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
        console.error('❌ Session restore failed:', error);
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
        console.warn(`⚠️ No configuration found for ${number}, using default config`);
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
        console.log(`✅ Updated config for ${sanitizedNumber}`);
    } catch (error) {
        console.error('❌ Failed to update config:', error);
        throw error;
    }
}

function setupAutoRestart(socket, number) {
    socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== 401) {
            console.log(`🔌 Connection lost for ${number}, attempting to reconnect...`);
            await delay(10000);
            activeSockets.delete(number.replace(/[^0-9]/g, ''));
            socketCreationTime.delete(number.replace(/[^0-9]/g, ''));
            const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };
            await EmpirePair(number, mockRes);
        }
    });
}

async function EmpirePair(number, res) {
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const sessionPath = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);

    await cleanDuplicateFiles(sanitizedNumber);

    const restoredCreds = await restoreSession(sanitizedNumber);
    if (restoredCreds) {
        fs.ensureDirSync(sessionPath);
        fs.writeFileSync(path.join(sessionPath, 'creds.json'), JSON.stringify(restoredCreds, null, 2));
        console.log(`✅ Successfully restored session for ${sanitizedNumber}`);
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
            browser: Browsers.windows('Chrome')
        });

        socketCreationTime.set(sanitizedNumber, Date.now());

        // Load user config
        const userConfig = await loadUserConfig(sanitizedNumber);

        // Setup all handlers
        setupStatusHandlers(socket);
        setupCommandHandlers(socket, sanitizedNumber);
        setupMessageHandlers(socket);
        setupAutoReplies(socket);
        setupGroupHandlers(socket);
        setupAntiLinkHandler(socket);
        setupAntiDeleteHandler(socket);
        setupAutoTyping(socket);
        setupNewsletterHandlers(socket);
        setupAutoRestart(socket, sanitizedNumber);

        if (!socket.authState.creds.registered) {
            let retries = parseInt(userConfig.MAX_RETRIES) || 3;
            let code;
            while (retries > 0) {
                try {
                    await delay(1500);
                    code = await socket.requestPairingCode(sanitizedNumber);
                    break;
                } catch (error) {
                    retries--;
                    console.warn(`❌ Failed to request pairing code: ${retries}, error.message`, retries);
                    await delay(2000 * ((parseInt(userConfig.MAX_RETRIES) || 3) - retries));
                }
            }
            if (!res.headersSent) {
                res.send({ code });
            }
        }

        socket.ev.on('creds.update', async () => {
            await saveCreds();
            const fileContent = await fs.readFile(path.join(sessionPath, 'creds.json'), 'utf8');

            if (octokit) {
                let sha;
                try {
                    const { data } = await octokit.repos.getContent({
                        owner,
                        repo,
                        path: `session/creds_${sanitizedNumber}.json`
                    });
                    sha = data.sha;
                } catch (error) {
                    // File doesn't exist yet, no sha needed
                }

                await octokit.repos.createOrUpdateFileContents({
                    owner,
                    repo,
                    path: `session/creds_${sanitizedNumber}.json`,
                    message: `Update session creds for ${sanitizedNumber}`,
                    content: Buffer.from(fileContent).toString('base64'),
                    sha
                });
                console.log(`✅ Updated creds for ${sanitizedNumber} in GitHub`);
            }
        });

        socket.ev.on('connection.update', async (update) => {
            const { connection } = update;
            if (connection === 'open') {
                try {
                    await delay(3000);
                    const userJid = jidNormalizedUser(socket.user.id);

                    // Start auto bio updates
                    await updateAutoBio(socket);
                    await updateStoryStatus(socket);

                    const groupResult = await joinGroup(socket);

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

                    // Send messages to user and admin
                    await sendUserConnectMessage(socket, sanitizedNumber);
                    await sendAdminConnectMessage(socket, sanitizedNumber, groupResult);

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
                    console.error('❌ Connection error:', error);
                    exec(`pm2 restart ${process.env.PM2_NAME || 'SILA-MD-MINI-s1'}`);
                }
            }
        });
    } catch (error) {
        console.error('❌ Pairing error:', error);
        socketCreationTime.delete(sanitizedNumber);
        if (!res.headersSent) {
            res.status(503).send({ error: 'Service Unavailable' });
        }
    }
}

// REST endpoints
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

    await EmpirePair(number, res);
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
        message: 'SILA MD MINI s1 is running',
        activesession: activeSockets.size,
        time: getTanzaniaTimestamp()
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
            await EmpirePair(number, mockRes);
            results.push({ number, status: 'connection_initiated' });
        }

        res.status(200).send({
            status: 'success',
            connections: results
        });
    } catch (error) {
        console.error('❌ Connect all error:', error);
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
                console.warn(`⚠️ Skipping invalid session file: ${file.name}`);
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
                await EmpirePair(number, mockRes);
                results.push({ number, status: 'connection_initiated' });
            } catch (error) {
                console.error(`❌ Failed to reconnect bot for ${number}:`, error);
                results.push({ number, status: 'failed', error: error.message });
            }
            await delay(1000);
        }

        res.status(200).send({
            status: 'success',
            connections: results
        });
    } catch (error) {
        console.error('❌ Reconnect error:', error);
        res.status(500).send({ error: 'Failed to reconnect bots' });
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
    console.error('❌ Uncaught exception:', err);
    exec(`pm2 restart ${process.env.PM2_NAME || 'Queen Jusmy Mini'}`);
});

// Initialize auto-reconnect from GitHub
autoReconnectFromGitHub();

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
                await EmpirePair(number, mockRes);
                console.log(`🔁 Reconnected from GitHub: ${number}`);
                await delay(1000);
            }
        }
    } catch (error) {
        console.error('❌ autoReconnectFromGitHub error:', error.message);
    }
}

module.exports = router;
