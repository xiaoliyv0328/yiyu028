const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8888;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';
  
  const filePath = path.join(ROOT, url);
  const ext = path.extname(filePath).toLowerCase();
  
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    // SPA fallback
    try {
      const html = fs.readFileSync(path.join(ROOT, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (e2) {
      res.writeHead(404);
      res.end('404');
    }
  }
}).listen(PORT, '0.0.0.0', () => {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  let ip = '127.0.0.1';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) { ip = net.address; break; }
    }
  }
  console.log(`\n╔═══════════════════════════════════╗`);
  console.log(`║  🏠 毅鱼科技官网 · 本地测试     ║`);
  console.log(`╠═══════════════════════════════════╣`);
  console.log(`║  💻  http://localhost:${PORT}       ║`);
  console.log(`║  📱  http://${ip}:${PORT}      ║`);
  console.log(`╚═══════════════════════════════════╝\n`);
});
