import { io } from 'socket.io-client'

export const socket = io('https://codelang.vercel.app', {
  withCredentials: true,
  autoConnect: false,
})
