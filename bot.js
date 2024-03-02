const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

let currentDisposableEmail = '';

bot.start((ctx) => {
    const username = ctx.from.username || 'not set';
    ctx.reply(`Hello 👋 ${ctx.from.first_name}
    
Why Disposablemailbot ?

Our Bot Offers 🎉

📧 Temporary Email Service
Welcome to our Temporary Email Service! Need a quick email address for verification or temporary communication? Our service offers disposable email addresses that you can use on-the-fly.

🔒 Privacy Guaranteed
Your privacy matters to us. Our disposable email addresses help you keep your inbox clutter-free and your personal email address private. No need to worry about spam or unwanted emails cluttering your primary inbox.

🕒 Short-lived Addresses
Our temporary email addresses are designed to be short-lived. Once you're done with them, they'll automatically expire, ensuring your inbox stays clean and clutter-free.

🚀 Fast and Easy
Getting a temporary email address is as easy as sending a message to our bot. No sign-ups or registrations required. Just start a conversation with us and get your disposable email address instantly!

🛡️ Security
Our service is secure and reliable. Rest assured that your temporary email communications are protected, and your sensitive information remains confidential.

type /email to get disposable mail 🚀 
type /info for information or assistance ℹ`);
});

bot.command('info', (ctx) => {
    ctx.reply('For more information or assistance, please contact the developer:\n\nSurajit Sen\nTelegram: @sensurajit');
});

bot.command('email', async (ctx) => {
    try {
        // Make a request to 1secmail API to get a disposable email address
        const response = await axios.get('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1');
        currentDisposableEmail = response.data[0];
        ctx.reply(`Here is your disposable email address: ${currentDisposableEmail}\nTo view latest mails type /fetchemails`);
    } catch (error) {
        console.error('Error retrieving disposable email address:', error);
        ctx.reply('Error retrieving disposable email address. Please try again later.');
    }
});

bot.command('fetchemails', async (ctx) => {
    try {
        if (!currentDisposableEmail) {
            ctx.reply('No disposable email address available. Please generate one using the /email command.');
            return;
        }

        // Make a request to 1secmail API to fetch emails for the current disposable email address
        const response = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${currentDisposableEmail.split('@')[0]}&domain=${currentDisposableEmail.split('@')[1]}`);

        const emails = response.data;
        if (emails.length === 0) {
            ctx.reply('No emails found for the current disposable email address.');
            return;
        }

        let message = 'Here are the latest emails:\n\n';
        emails.forEach((email, index) => {
            message += `Email ${index + 1}:\n`;
            message += `From: ${email.from}\n`;
            message += `Subject: ${email.subject}\n\n`;
        });

        ctx.reply(message);
    } catch (error) {
        console.error('Error fetching emails:', error);
        ctx.reply('Error fetching emails. Please try again later.');
    }
});

module.exports = bot;
