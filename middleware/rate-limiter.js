import rateLimit from "express-rate-limit";
import { config } from "../config.js";

export default rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequest,
  // keyGenerator: (req, res) => req.ip // default. 각 ip 당 rate-limiter를 설정함.
  keyGenerator: (req, res) => "dwitter", // global하게 request를 count할 수 있음
});
