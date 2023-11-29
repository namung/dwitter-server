import jwt from "jsonwebtoken";
import * as userRepository from "../data/auth.js";
import { config } from "../config.js";

const AUTH_ERROR = { message: "Authorization Error" };
const jwtSecretKey = config.jwt.secretKey;

// 비동기 callback 함수, 즉 비동기 미들웨어 함수
// 로그인 했니?
export const isAuth = async (req, res, next) => {
  // 1. Check Cookie exits (for Browser)
  // 2. Check Header (for Non-Browser Client)

  let token;
  // check the header first

  // request header의 Authorization key이 값을 받아 옴
  const authHeader = req.get("Authorization");

  // authorization request validation
  // 헤더에 토큰이 있다면,
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // jwt token validation
    // 'Breare ' 뒤의 jwt를 가져옴
    token = authHeader.split(" ")[1];
  }

  // 헤더에 토큰이 없다면, check cookie
  if (!token) {
    token = req.cookies["token"];
  }

  // 그래도 token 값이 없다면 -> send auth error response
  if (!token) {
    return res.status(401).json(AUTH_ERROR);
  }

  // jwt 유효성 검사 실행
  jwt.verify(token, jwtSecretKey, async (error, decoded) => {
    if (error) {
      // 유효하지 않다면,
      // TODO: 훗날.. 만료 토큰이면 refresh 토큰 발급 과정 넣자
      console.error(error);
      return res.status(401).json(AUTH_ERROR);
    } else {
      // 유효하다면
      // jwt decode된 곳에서 유저 고유 index id를 가지고서... is user in database?
      const user = await userRepository.findById(decoded.id);
      if (!user) {
        return res.status(401).json(AUTH_ERROR);
      }
      // then... ok. this request pass.
      // create request custom data(unique DB userId).
      req.userId = user.id;
      req.toekn = token;
      next();
    }
  });
};
