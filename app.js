import express from "express";
import "express-async-error";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dweetsRouter from "./router/dweets.js";
import authRouter from "./router/auth.js";
import { config } from "./config.js";
import { initSocket } from "./connection/socket.js";
import { sequelize } from "./db/database.js";

// 기초 서버 설정
const app = express();

// CORS OPTION
const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
};

// 미들웨어 설정
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan("tiny"));

// 라우팅 설정
// 1. Dweets
app.use("/dweets", dweetsRouter);
// 2. Auth
app.use("/auth", authRouter);

// 지원하지 않는 api
app.use((req, res, next) => {
  res.sendStatus(404);
});

// 에러 핸들링
app.use((error, req, res, next) => {
  if (res.status >= 500) {
    console.error(error);
    res.status(500).json(error);
  } else {
    res.status(400).json(error);
  }
});

// db 연결. sync()로 우리 모델에서 정리한 스키마를 테이블로 생성
sequelize.sync().then(() => {
  // 서버 포트 설정
  const server = app.listen(config.host.port);

  // 소켓 설정
  initSocket(server);
});
