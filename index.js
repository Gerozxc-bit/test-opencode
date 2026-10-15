const { spawn } = require('child_process');

// Render автоматически назначает порт через переменную окружения PORT (обычно 10000)
const port = process.env.PORT || 10000;

console.log(`Starting OpenCode on port ${port}...`);

// Формируем аргументы для запуска сервера OpenCode
// --hostname 0.0.0.0 обязателен, чтобы Render мог перенаправлять трафик
const args = ['opencode', 'serve', '--hostname', '0.0.0.0', '--port', String(port)];

// Запускаем OpenCode как дочерний процесс
// stdio: 'inherit' позволяет видеть логи OpenCode прямо в панели Render
// shell: true нужен для корректного запуска npx в Linux-окружении Render
const opencode = spawn('npx', args, {
  stdio: 'inherit',
  shell: true,
  // Передаем все переменные окружения Render (включая OPENCODE_SERVER_PASSWORD) в OpenCode
  env: { ...process.env } 
});

// Обработка ошибок запуска
opencode.on('error', (err) => {
  console.error('Failed to start OpenCode:', err);
});

// Логирование завершения процесса
opencode.on('close', (code) => {
  console.log(`OpenCode process exited with code ${code}`);
});

// Корректное завершение при перезапуске сервера Render
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down OpenCode...');
  opencode.kill();
  process.exit(0);
});
