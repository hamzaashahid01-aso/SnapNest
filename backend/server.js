require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`SnapNest API running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[SnapNest] Port ${PORT} is already in use.\nRun: netstat -ano | findstr :${PORT}  then  taskkill /F /PID <pid>\n`);
  } else {
    console.error('[SnapNest] Server error:', err.message);
  }
  process.exit(1);
});
