const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');

const PORT = process.env.PORT || 3000;

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
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': 2592000
    };

    if (req.method === 'OPTIONS') {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    if (pathname.startsWith('/api/proxy')) {
        const targetUrl = parsedUrl.query.url;
        if (!targetUrl) {
            res.writeHead(400);
            return res.end('URL required');
        }

        const fetchModule = targetUrl.startsWith('https') ? https : http;
        
        fetchModule.get(targetUrl, (proxyRes) => {
            const proxyHeaders = { ...proxyRes.headers, ...headers };
            delete proxyHeaders['x-frame-options'];
            delete proxyHeaders['content-security-policy'];
            delete proxyHeaders['frame-options'];
            
            res.writeHead(proxyRes.statusCode, proxyHeaders);
            proxyRes.pipe(res);
        }).on('error', (err) => {
            res.writeHead(500);
            res.end('Proxy Error');
        });
        return;
    }

    if (pathname.startsWith('/api/v1')) {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                res.writeHead(200, { 'Content-Type': 'application/json', ...headers });
                
                if (pathname === '/api/v1/discord/validate') {
                    const data = JSON.parse(body || '{}');
                    const id = data.id || "";
                    if (/^\d{17,20}$/.test(id)) {
                        const mockUser = "User_" + id.substring(0, 5); 
                        res.end(JSON.stringify({ valid: true, username: mockUser, discriminator: "0000" }));
                    } else {
                        res.end(JSON.stringify({ valid: false }));
                    }
                    return;
                }

                if (pathname === '/api/v1/keys/create') {
                    const key = 'bp_live_' + crypto.randomBytes(12).toString('hex');
                    res.end(JSON.stringify({ success: true, key: key, tier: 'free' }));
                    return;
                }

                if (pathname === '/api/v1/keys/validate-paid') {
                    const data = JSON.parse(body || '{}');
                    const isValid = data.key && data.key.startsWith('bp_paid_');
                    res.end(JSON.stringify({ valid: isValid, tier: isValid ? 'premium' : 'invalid' }));
                    return;
                }

                res.end(JSON.stringify({ error: "Endpoint not found" }));
            });
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json', ...headers });
            res.end(JSON.stringify({ error: "Method Not Allowed" }));
        }
        return;
    }

    let filePath = '.' + pathname;
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
    console.log(`BatProx Host running on port ${PORT}`);
});
