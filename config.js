import dotenv from "dotenv";
dotenv.config();

// 환경변수 값이 설정되어 있는지 확인하는 코드 필요
function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

export const config = {
  jwt: {
    secretKey: required("JWT_SECRET"),
    expiresInSec: parseInt(required("JWT_EXPIRES_SEC", 17280000)),
  },
  bcrypt: {
    saltRound: parseInt(required("BCRYPT_SALT_ROUND", 12)),
  },
  host: {
    port: parseInt(required("HOST_PORT", 3000)),
  },
  db: {
    host: required("DB_HOST"),
    user: required("DB_USER"),
    database: required("DB_DATABASE"),
    // password: required("DB_PASSWORD"),
  },
  cors: {
    allowedOrigin: required("CORS_ALLOW_ORIGIN"),
  },
};
