import { Server } from 'http';
import socket from 'socket.io';

export class Socket {
  public io: socket.Server

  constructor(http: Server) {
    this.io = socket(http)
    this.connect()
  }

  public connect() {
    this.io.on('connection', (client: socket.Socket) => {
      // tslint:disable-next-line: no-console
      console.info(` connected : ${client.id}`)
      this.handlers(client)
    })
  }

  public handlers(client: socket.Socket) {
    client.on('disconnect', () => {
      // tslint:disable-next-line: no-console
      console.info(`Socket disconnected : ${client.id}`)
    })
  }
}
