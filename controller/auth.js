import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepository from "../data/auth.js";
import { config } from "../config.js";

const jwtSecretKey = config.jwt.secretKey;
const jwtExpiresInMs = config.jwt.expiresInMs;
const bcryptSaltRounds = config.bcrypt.saltRound;

export async function signup(req, res, next) {
  // const username = req.body.username;
  // const password = req.body.password;
  // const name = req.body.name;
  // let url = req.body.url; // optional

  const { username, password, name, email, url } = req.body;

  // 이미 있는 유저인지 체크
  const found = await userRepository.findByUsername(username);
  if (found) {
    return res.status(409).json({ message: `${username} is already exists` });
  }

  // password hashing
  const hashed = await bcrypt.hash(password, bcryptSaltRounds);

  // 유저 생성
  const user = {
    username,
    password: hashed,
    name,
    email,
    url,
  };
  const userId = await userRepository.createUser(user);

  // 토큰 발급
  const token = createJwtToken(userId);

  // res.setHeader("Authorization", "Bearer " + token);
  // return res.status(201).json({ username });

  // 기존에 그냥 json body로 보냈던 token을 http only cookie로 보내기
  setToken(res, token);

  // cookie header로 보내면 REST APIs 이용하는 다른 client들은 사용불가함 -> 여전히 body 부분은 그래도 둠
  return res.status(201).json({ token, username });
}

export async function login(req, res, next) {
  // const username = req.body.username;
  // const password = req.body.password;
  const { username, password } = req.body;

  // 로그인 시도하는 유저가 데이터에 있는 유저인지 확인
  const user = await userRepository.findByUsername(username);

  if (!user) {
    return res.status(401).json({ message: "Invalid user or password" });
  } else {
    const isVlidPassword = await bcrypt.compare(password, user.password);
    if (!isVlidPassword) {
      console.log("패스워드 불일치");
      return res.status(401).json({ message: "Invalid user or password" });
    } else {
      console.log("패스워드 일치함. 로그인 성공");

      // token 발급
      const token = createJwtToken(user.id);
      setToken(res, token);
      // res.setHeader("Authorization", "Bearer " + token);
      return res.status(200).json({ token, username });
    }
  }
}

function createJwtToken(id) {
  // token 발급
  return jwt.sign(
    {
      id,
    },
    jwtSecretKey,
    { expiresIn: jwtExpiresInMs }
  );
}

function setToken(res, token) {
  const options = {
    maxAge: jwtExpiresInMs,
    httpOnly: true,
    sameSite: "none", // 서버와 클라이언트가 동일한 domain이 아니더라도 동작하도록 함. none일 때 secure 옵션을 true로.
    secure: true,
  };
  res.cookie("token", token, options); // HTTP-ONLY COOKIE
}

export async function me(req, res, next) {
  // auth middleware에서도 user가 db에 있는지 확인했는데, 한 번 더 하는 이유? 응답에 username이라는 유저 정보를 보내주기 위함...
  const user = await userRepository.findById(req.userId); // auth middleware 에서 custom으로 등록한 request의 id. == userId
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    res.status(200).json({ toke: req.token, username: user.username });
  }
}
