import { io } from 'socket.io-client';

const socket = io('https://codelang.vercel.app', {
  path: '/socket.io',
  transports: ['polling', 'websocket'], 
});

export default socket;
