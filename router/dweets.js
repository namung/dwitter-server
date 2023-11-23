// import 순서: 외부 라이브러리, 프로젝트 안 라이브러리
import express from "express";
import "express-async-error";
import { param, body } from "express-validator";
import * as tweetController from "../controller/dweet.js";
import { validate } from "../middleware/validator.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// validation
const validateDweet = [
  body("text")
    .trim()
    .isLength({ min: 3 })
    .withMessage("text shoul be at least 3 characters"),
  validate,
];

const validateParam = [
  param("id").isInt().withMessage("숫자를 입력하세요"),
  validate,
];

// GET /dweets
// GET /dweets?username=str

// router로 왔기때문에 기본 /dweets 는 생략 가능.
router.get("/", isAuth, tweetController.getDweets);

// GET /dweets/:id
router.get(
  "/:id",
  isAuth,
  validateParam, // param은 잘못된 걸 입력하면 앞단에서 404를 return하기 때문에 하지 않아도 됨.
  tweetController.getDweetById
);

// POST /dweets
router.post("/", isAuth, validateDweet, tweetController.createDweet);

// PUT /dweets/:id
router.put("/:id", isAuth, validateDweet, tweetController.updateDweetById);

// DELETE /dweets/:id
router.delete("/:id", isAuth, validateParam, tweetController.deleteDweetById);

export default router;
