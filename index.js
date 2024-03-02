const { createServer } = require('http');
const { parse } = require('url');
const bot = require('./bot');

const server = createServer((req, res) => {
    const { pathname } = parse(req.url);

    if (pathname === '/.well-known/health-check') {
        // Health check endpoint for Vercel
        res.writeHead(200);
        res.end('OK');
    } else if (pathname === '/') {
        // Handle Telegram bot webhook verification
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            const webhookData = JSON.parse(data);
            if (webhookData.message) {
                bot.handleUpdate(webhookData);
            }
            res.writeHead(200);
            res.end('OK');
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});
