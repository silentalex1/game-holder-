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
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

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

    if (pathname === '/favicon.ico') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (pathname.startsWith('/api/proxy')) {
        const targetUrl = parsedUrl.query.url;
        if (!targetUrl) {
            res.writeHead(400);
            return res.end('URL required');
        }

        const lib = targetUrl.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        };

        const proxyReq = lib.get(targetUrl, options, (proxyRes) => {
            if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
                res.writeHead(302, { 'Location': `/api/proxy?url=${encodeURIComponent(proxyRes.headers.location)}` });
                res.end();
                return;
            }

            const proxyHeaders = { ...proxyRes.headers, ...headers };
            delete proxyHeaders['x-frame-options'];
            delete proxyHeaders['content-security-policy'];
            delete proxyHeaders['frame-options'];
            
            res.writeHead(proxyRes.statusCode, proxyHeaders);
            proxyRes.pipe(res);
        });

        proxyReq.on('error', (err) => {
            res.writeHead(500);
            res.end('');
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
                        res.end(JSON.stringify({ valid: true, username: "User_" + id.slice(-4) }));
                    } else {
                        res.end(JSON.stringify({ valid: false }));
                    }
                    return;
                }

                if (pathname === '/api/v1/keys/create') {
                    const key = 'bp_' + crypto.randomBytes(12).toString('hex');
                    res.end(JSON.stringify({ success: true, key: key }));
                    return;
                }

                res.end(JSON.stringify({ error: "Not Found" }));
            });
        } else {
            res.writeHead(405, headers);
            res.end();
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
                fs.readFile('./index.html', (err, main) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(main, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
