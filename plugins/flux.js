const axios = require('axios');

module.exports = {
    command: "flux2",
    alias: ["fluximg", "aiimg", "generate", "imgai", "imagine"],
    description: "Generate AI images using FLUX model",
    category: "ai",
    react: "🎨",
    usage: ".flux2 [prompt]",

    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;
            const text = args.join(" ").trim();

            // Send initial reaction
            await sock.sendMessage(from, { react: { text: "⏳", key: msg.key } });

            if (!text) {
                await sock.sendMessage(from, {
                    text: `*🎨 FLUX AI IMAGE GENERATOR*\n\nPlease provide a prompt for the image.\n\n*Example:* .flux2 a beautiful sunset over mountains\n\n*Usage:* .flux2 [your image description]`
                }, { quoted: msg });
                await sock.sendMessage(from, { react: { text: "❌", key: msg.key } });
                return;
            }

            // Send processing message
            await sock.sendMessage(from, {
                text: `*🔄 GENERATING IMAGE...*\n\n*Prompt:* ${text}\n\nPlease wait while I create your image...`
            }, { quoted: msg });

            // API URL
            const apiUrl = `https://api.bk9.dev/ai/fluximg?q=${encodeURIComponent(text)}`;
            
            console.log(`🔄 Generating FLUX image for prompt: ${text}`);

            // Make API request
            const response = await axios.get(apiUrl, {
                responseType: 'arraybuffer',
                timeout: 60000 // 60 seconds timeout
            });

            if (!response.data || response.data.length < 1000) {
                throw new Error('No valid image data received from API');
            }

            // Convert to buffer
            const imageBuffer = Buffer.from(response.data, 'binary');

            // Send the generated image
            await sock.sendMessage(from, {
                image: imageBuffer,
                caption: `*🎨 AI IMAGE GENERATED*\n\n*Prompt:* ${text}\n*Model:* FLUX AI\n*Powered by:* SILA MD MINI s1`
            }, { quoted: msg });

            // Success reaction
            await sock.sendMessage(from, { react: { text: "✅", key: msg.key } });

            console.log(`✅ FLUX image generated successfully for: ${text}`);

        } catch (error) {
            console.error('❌ FLUX Image Generation Error:', error);
            
            let errorMessage = '*❌ IMAGE GENERATION FAILED*\n\n';
            
            if (error.response?.status === 429) {
                errorMessage += '*API Limit Exceeded*\nToo many requests. Please try again later.';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage += '*Request Timeout*\nImage generation took too long. Try a simpler prompt.';
            } else if (error.response?.status === 400) {
                errorMessage += '*Invalid Prompt*\nYour prompt may contain inappropriate content.';
            } else if (error.response?.status === 404) {
                errorMessage += '*Service Unavailable*\nAI service is currently down. Please try again later.';
            } else if (error.message?.includes('valid image data')) {
                errorMessage += '*Invalid Response*\nThe AI service returned an invalid image. Please try again.';
            } else {
                errorMessage += '*Server Error*\nPlease try again later or use a different prompt.';
            }

            errorMessage += '\n\n*💡 TIPS:*\n• Use clear, descriptive prompts\n• Avoid sensitive content\n• Try shorter prompts\n• Check your internet connection';

            await sock.sendMessage(msg.key.remoteJid, {
                text: errorMessage
            }, { quoted: msg });

            await sock.sendMessage(from, { react: { text: "❌", key: msg.key } });
        }
    }
};
