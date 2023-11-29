export const csrfCheck = (req, res, next) => {
  if (
    req.method === "GET" ||
    req.method === "OPTIONS" ||
    req.method === "HEAD"
  ) {
    // 무언가 변경하는 것이 아니기 때문에 csrf로부터 안전. next로 넘어감
    return next();
  }

  const csrfHeader = req.get("dwitter-csrf-token");

  if (!csrfHeader) {
    // csrf 토큰 빠져있네? 의심가는 api 요청이므로 일단 warning으로 log 남겨둠.
    console.warn(
      'Missing required "dwitter-csrf-token" header.',
      req.headers.origin
    );
    return res.status(403).json({ message: "Failed CSRF check" });
  }

  validateCsrfToken(csrfHeader)
    .then((valid) => {
      if (!valid) {
        console.warn(
          'Value provided in "dwitter-csrf-token" header does not validate.',
          req.headers.origin,
          csrfHeader
        );
        return res.status(403).json({ message: "Failed CSRF check" });
      }
      next();
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    });
};

async function validateCsrfToken(csrfHeader) {
  return bcrypt.compare(config.csrf.plainToken, csrfHeader);
}
