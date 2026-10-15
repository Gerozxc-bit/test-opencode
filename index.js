const { spawn } = require('child_process');
const http = require('http');

// Render автоматически назначает порт через переменную окружения PORT
const port = process.env.PORT || 4096;

// Запускаем сервер OpenCode как дочерний процесс
// Флаг --hostname 0.0.0.0 обязателен, чтобы Render мог пробросить трафик извне
const opencode = spawn('npx', ['opencode', 'serve', '--port', String(port), '--hostname', '0.0.0.0'], {
  stdio: 'inherit',
  shell: true
});

// Простой HTTP-сервер-заглушка для проверки работоспособности
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OpenCode server is running!\n');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`OpenCode proxy listening on port ${port}`);
});

// Обработка завершения процесса
process.on('SIGTERM', () => {
  opencode.kill();
  server.close();
});
