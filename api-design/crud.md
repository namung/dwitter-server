# Dweet API

- api 디자인: 서버가 가지고 있는 리소스를 우선 명확히 정의.
- 그 후 디자인 하기

## API

- dwitter schema

```json
{
    id: string, // 드윗 아이디
    name: string, // 사용자 이름
    username: string, // 사용자 아이디
    url: string, (optional) // 사용자 프로필 사진 url
    text: string, // 드윗 텍스트
    createdAt: Date, // 드윗 생성일자

}
```

- 전체 유저 드윗 모두 읽기
  - `GET /dweets`
    - req
      - query parameter: none
    - res 200
      - body
        ```json
        {
            [dwitter, dwitter, dwitter, ...]
        }
        ```
      - message: none
- 한 명의 유저 드윗 모두 읽기

  - `GET /dweets?username=str`
    - req
      - query parameter: username
    - res 200
      - body
        ```json
        {
            [dwitter, dwitter, dwitter, ...]
        }
        ```
      - message: none

- 한 명의 유저 드윗 읽기

  - `GET /dweets/:id`
    - req
      - query parameter: none
    - res 200
      - body
        ```json
        {
            dwitter
        }
        ```
      - message: none

- 새로운 드윗 만들기
  - `POST /dweets`
    - req
      - body
        ```json
        {
            username: string,
            name: string,
            text: string
        }
        ```
    - res 201
      - body
        ```json
        {
            dwitter
        }
        ```
      - message: none
- 드윗 수정하기
  - `PUT /dweets/:id`
    - req
      - body
        ```json
        {
            text: string,
        }
        ```
    - res 200
      - body
        ```json
        {
            dwitter
        }
        ```
      - message: none
- 드윗 삭제하기

  - `DELETE /dweets/:id`

    - req

      - body: none

    - res 204
      - message: none
