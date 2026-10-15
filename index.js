const { spawn } = require('child_process');
const http = require('http');

// Render автоматически назначает порт через переменную окружения PORT
const port = process.env.PORT || 4096;

// Запускаем сервер OpenCode как дочерний процесс
// Команда: opencode serve --hostname 0.0.0.0 --port <port>
// Флаг --hostname 0.0.0.0 обязателен, чтобы Render мог пробросить трафик извне
const opencode = spawn('opencode', ['serve', '--hostname', '0.0.0.0', '--port', String(port)], {
  stdio: 'inherit',
  shell: true
});

// Слушаем вывод от OpenCode, чтобы видеть логи в панели Render
opencode.stdout.on('data', (data) => {
  console.log(`[OpenCode]: ${data}`);
});

opencode.stderr.on('data', (data) => {
  console.error(`[OpenCode Error]: ${data}`);
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
