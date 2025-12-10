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

const apiKeys = new Map();

const server = http.createServer((req, res) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000
    };

    if (req.method === 'OPTIONS') {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    let filePath = '.' + req.url;
    
    if (req.url.startsWith('/api/v1')) {
        res.writeHead(200, { 'Content-Type': 'application/json', ...headers });
        
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

        if (req.url === '/api/v1/keys/create' && req.method === 'POST') {
            const key = 'bp_' + crypto.randomBytes(16).toString('hex');
            apiKeys.set(key, { tier: 'free', limit: 1000 });
            res.end(JSON.stringify({
                success: true,
                key: key,
                tier: "Free",
                message: "Key active. Upgrade for Edge Caching."
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
