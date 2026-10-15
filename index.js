const { spawn } = require('child_process');
const http = require('http');

const port = process.env.PORT || 4096;

// Запускаем OpenCode через npx (он установится локально из package.json)
const opencode = spawn('npx', ['opencode', 'serve', '--hostname', '0.0.0.0', '--port', String(port)], {
  stdio: 'inherit', // Логи OpenCode будут автоматически видны в панели Render
  shell: true
});

// Простой HTTP-сервер, чтобы Render видел, что порт открыт
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OpenCode server is running!\n');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Proxy listening on port ${port}`);
});

// Корректное завершение при перезапуске
process.on('SIGTERM', () => {
  opencode.kill();
  server.close();
});
