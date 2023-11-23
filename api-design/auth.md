# 로그인 api

- 회원 (User)

```json
{   id = string // db의 고유 id
    username(:=회원가입시 id): string
    password: string
    name: string
    email: string
    profileURL(optional): string
}
```

- 회원 가입

  - `POST /auth/signup`
  - request body
    ```json
    {
        username,
        password,
        name,
        email,
        url,
    }
    ```
  - response 204
    - body
    ```json
    {
      JWT,
      username
    }
    ```

- 로그인

  - `POST /auth/login`
  - request body

    ```json
    {
        username,

        password
    }
    ```

  - response 200
    - body
    ```json
    {
      JWT,
      username
    }
    ```

- 기존 토큰 유효성 검사

  - `GET /auth/me`
  - request query
    ```json
    {
      JWT,
      username
    }
    ```
