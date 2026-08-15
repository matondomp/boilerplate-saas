import { io } from 'socket.io-client'

class SocketioService {
  socket
  constructor() {}

  setupSocketConnection() {
    if (!this.socket) {
      this.socket = io({
        transports: ['websocket', 'polling'],
      })
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}

export default new SocketioService()
