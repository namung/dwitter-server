import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

class Socket {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    this.io.use((socket, next) => {
      // const token = socket.handshake.query && socket.handshake.query.token;
      // 위처럼 query를 통해 작성하면 안됨. 표준적으로 정의됨 auth를 이용해야 함.
      // 이유: 브라우저나 콘솔에서 토큰이 보이거나 로그에 남을 수 있음.
      // 그래서 반드시 handshake안의 auth를 이용해야 함.
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }
      jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
        if (error) {
          return next(new Error("Authentication Error"));
        }
        next();
      });
    });

    this.io.on("connection", (socket) => {
      console.log("Socket client connected");
    });
  }
}

let socket;
export function initSocket(server) {
  if (!socket) {
    socket = new Socket(server);
  }
}

export function getSocketIO() {
  if (!socket) {
    throw new Error("Please call init first");
  }

  return socket.io;
}
