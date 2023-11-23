import { getSocketIO } from "../connection/socket.js";
import * as dweetRepository from "../data/dweet.js";

export async function getDweets(req, res, next) {
  const username = req.query.username;
  // if 문으로 req 데이타 가져오는데 해당 데이터가 있으면 true, 없으면 undefined, 즉 false
  const data = await (username
    ? dweetRepository.getAllByUsername(username)
    : dweetRepository.getAll());

  res.status(200).json(data); // sendStatus 쓰면 안됨. 상태코드와 함께 바로 res하기 때문.
}

export async function getDweetById(req, res, next) {
  const req_params_id = req.params.id;
  const dweet = await dweetRepository.getById(req_params_id); // 데이터 하나 찾음 -> array의 find() 사용하기

  if (dweet) {
    res.status(200).json(dweet);
  } else {
    res.status(404).json({
      message: `Dweet id(${req_params_id}) not found`,
    });
  }
}

export async function createDweet(req, res, next) {
  const text = req.body.text;
  const userId = req.userId;
  const dweet = await dweetRepository.create(text, userId);
  res.status(201).json(dweet);
  getSocketIO().emit("dweets", dweet);
}

export async function updateDweetById(req, res, next) {
  const id = req.params.id;
  const text = req.body.text;

  const dweet = await dweetRepository.getById(id);
  if (!dweet) {
    return res.sendStatus(404);
  }
  if (dweet.userId !== req.userId) {
    // 401: 로그인이 필요한 서비스인데 로그인 하지 않았을 때, 403: 로그인된 사용자이지만 특별한 권한이 없을 때
    return res.sendStatus(403);
  }

  const updated = await dweetRepository.update(id, text);

  res.status(200).json(updated);
}

export async function deleteDweetById(req, res, next) {
  const id = req.params.id;

  const dweet = await dweetRepository.getById(id);
  if (!dweet) {
    return res.sendStatus(404);
  }
  if (dweet.userId !== req.userId) {
    // 401: 로그인이 필요한 서비스인데 로그인 하지 않았을 때, 403: 로그인된 사용자이지만 특별한 권한이 없을 때
    return res.sendStatus(403);
  }

  await dweetRepository.deleteById(id);
  res.sendStatus(204);
}
