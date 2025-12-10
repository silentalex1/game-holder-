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

const server = http.createServer((req, res) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, DELETE',
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
        
        if (req.url === '/api/v1/discord/validate') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                const data = JSON.parse(body || '{}');
                const mockUsername = "User_" + data.id.substring(0, 4); 
                res.end(JSON.stringify({ valid: true, username: mockUsername }));
            });
            return;
        }

        if (req.url === '/api/v1/keys/create') {
            const key = 'bp_live_' + crypto.randomBytes(12).toString('hex');
            res.end(JSON.stringify({ success: true, key: key }));
            return;
        }

        res.end(JSON.stringify({ error: "Unknown Endpoint" }));
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
