import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import { isAuth } from "../middleware/auth.js";
import * as authController from "../controller/auth.js";

const router = express.Router();

const validateCredential = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isLength({ min: 3, max: 10 })
    .withMessage("Check your username's length"),
  body("password")
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("Check your password's length"),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3, max: 10 })
    .withMessage("Check your username's length"),
  body("email").trim().isEmail().normalizeEmail().withMessage("invalid email"),
  body("url").trim().isURL().withMessage("invalid URL").optional({
    values: "falsy",
  }),
  validate,
];

router.post("/signup", validateSignup, authController.signup);

router.post("/login", validateCredential, authController.login);

router.post("/logout", authController.logout);

// 유저가 유효한지 아닌지 검증하는 api.
// 정확히는, authentication을 수행함. 로그인 한지 안한지.
// authorization은 권한부여.
// 1. 로그인 하였는지(+ DB에 있는 유저인지) 확인 후 로그인 했다면 request에 db index id를 넣고, 2. 이후 해당 유저의 db 속 username을 가져와 클라이언트에게 return하는 api
// 보통 이 router는 클라이언트가 앱 실행시 먼저 호출해서, 유저가 로그인 한 유저인지 아닌지 체크하는 용도로 쓰임
// isAuth 미들웨어는 모든 라우터에 사용 가능. -> request에 userId(고유 db index)가 있으면 너 허용된 사용자구나? 함.
router.get("/me", isAuth, authController.me);

export default router;
