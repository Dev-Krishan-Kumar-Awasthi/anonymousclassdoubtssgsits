import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createApp } from './app';
import { config } from './config';
import { initSocketServer } from './socket';

const app = createApp();
const server = http.createServer(app);

// Initialize Socket.IO with institutional CORS policy
export const io = new SocketIOServer(server, {
  cors: {
    origin: [config.clientUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

initSocketServer(io);

if (process.env.NODE_ENV !== 'test') {
  server.listen(config.port, () => {
    console.log(`====================================================`);
    console.log(`  SGSITS Anonymous - IT Department Backend Server  `);
    console.log(`  Port: ${config.port} | Mode: ${config.nodeEnv} `);
    console.log(`  Timezone: ${config.timezone} `);
    console.log(`  Health: http://localhost:${config.port}/api/health`);
    console.log(`====================================================`);
  });
}

export { server, app };
