const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DOMAIN = "gamesholder.site";

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.svg': 'image/svg+xml'
};

const userKeys = new Map();

const server = http.createServer((req, res) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': 2592000
    };

    if (req.method === 'OPTIONS') {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    let filePath = '.' + req.url;
    
    // API V1 Endpoints
    if (req.url.startsWith('/api/v1')) {
        res.writeHead(200, { 'Content-Type': 'application/json', ...headers });
        
        // Mock Discord Lookup (Real logic would require a bot token)
        if (req.url.startsWith('/api/v1/discord/lookup') && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const { id } = JSON.parse(body || '{}');
                // Deterministic mock for functionality demonstration
                if (id && /^\d{17,19}$/.test(id)) {
                    res.end(JSON.stringify({ 
                        valid: true, 
                        username: `User_${id.substring(0,4)}`, 
                        discriminator: '0000' 
                    }));
                } else {
                    res.end(JSON.stringify({ valid: false, error: "Invalid Discord ID format." }));
                }
            });
            return;
        }

        // Key Generation
        if (req.url === '/api/v1/keys/generate' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const { discordId } = JSON.parse(body || '{}');
                if (!userKeys.has(discordId)) userKeys.set(discordId, []);
                
                const keys = userKeys.get(discordId);
                if (keys.length >= 4) {
                    res.end(JSON.stringify({ success: false, message: "Max 4 keys allowed." }));
                    return;
                }

                const newKey = `bp_${discordId}_${crypto.randomBytes(4).toString('hex')}`;
                keys.push({ key: newKey, created: Date.now(), tier: 'Freemium' });
                
                res.end(JSON.stringify({ success: true, key: newKey, keys: keys }));
            });
            return;
        }

        // Status
        if (req.url === '/api/v1/status') {
            res.end(JSON.stringify({
                status: "Operational",
                domain: DOMAIN,
                nodes: 48,
                load: "Low",
                region: "Auto-Global"
            }));
            return;
        }

        res.end(JSON.stringify({ error: "Endpoint not found" }));
        return;
    }

    if (filePath === './') filePath = './index.html';
    if (filePath === './ourapi') filePath = './ourapi.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile('./index.html', (err, mainContent) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(mainContent, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`BatProx Node running on port ${PORT}`);
});
