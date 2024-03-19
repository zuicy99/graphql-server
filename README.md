# REST API SERVER 구축

- GET
- POST
- PUT/PATCH
- DELETE

# Node.js 기반 서버 구축

- Express.js
- Nodemone 자동 재실행
- Node.js 기반 프로젝트 생성

## Node.js 프로젝트 생성

- `npm init`

## 최초 실행 파일 생성

-index.js

```js
console.log("Hellow World");
```

- 터미널에서 실행

```txt
node index.js
```

## 서버가 계속해서 실행하면서 수정내용 반영

- `npm install -g nodemon`
- 터미널에서 실행

```txt
nodemon index.js
```

## 스크립트 명령어 생성

- package.json 추가

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  },
```

- 터미널에서 실행

```txt
npm start
```

## express 및 기타 모듈 설치

- `npm install express`
- `npm install convert-csv-to-json`

## 테스트를 위한 소스

- 플러그인 (Edit CSV 설치)
- data 폴더 생성 /
- data/todos.csv 파일 생성

```csv
id,title,completed,date,weather
1,공부중입니다.,false,2023-04-01,1
2,리액트공부,false,2023-04-02,2
3,html 공부,true,2023-04-03,2
4,css 공부,true,2023-04-04,3
5,js 공부,false,2023-04-05,3
6,git공부,true,2023-04-06,5
7,서버공부,true,2023-04-07,4
```

- routes 폴더 생성 / todo.js 생성

```js
const express = require("express");
const api = express.Router();
const database = require("../database.js");
// GET : todo 목록 전체 읽어오기
api.get("/", (req, res) => {
  let result = database.todos;
  Object.keys(req.query).forEach((key) => {
    result = result.filter((data) => {
      return data[key] && data[key].toString() === req.query[key].toString();
    });
  });
  res.send(result);
});

// GET : todo 목록 ID 읽어오기
api.get("/:id", (req, res) => {
  res.send(
    database.todos.filter((data) => {
      return data.id && data.id.toString() === req.params.id.toString();
    })[0]
  );
});

// POST : todo 목록 추가하기
api.post("/", (req, res) => {
  const data = {
    id: database.todos.length + 1,
  };
  Object.keys(req.body).forEach((key) => {
    data[key] = req.body[key];
  });
  database.todos = [...database.todos, data];
  res.send(data);
});

// PUT : todo 목록 아이디 수정하기
api.put("/:id", (req, res) => {
  let result = null;
  database.todos
    .filter((data) => {
      return data.id && data.id.toString() === req.params.id.toString();
    })
    .map((data) => {
      Object.keys(data).forEach((key) => {
        delete data[key];
      });
      Object.assign(data, req.body);
      data.id = req.params.id;
      result = data;
    });
  res.send(result);
});

// DELETE : todo 목록 ID 삭제하기
api.delete("/:id", (req, res) => {
  const result = database.todos.filter((data) => {
    return data.id && data.id.toString() === req.params.id.toString();
  });
  database.todos = database.todos.filter((data) => {
    return !data.id || data.id.toString() !== req.params.id.toString();
  });
  res.send(result);
});

module.exports = api;
```

- database.js 파일 생성

```js
const csvToJson = require("convert-csv-to-json");

const database = {
  todos: [],
};
Object.keys(database).forEach((key) => {
  database[key] = [
    ...database[key],
    ...csvToJson.fieldDelimiter(",").getJsonFromCsv(`./data/${key}.csv`),
  ];
  if (database[key].length > 0) {
    const firstItem = database[key][0];
    Object.keys(firstItem).forEach((itemKey) => {
      if (
        database[key].every((item) => {
          return /^-?\d+$/.test(item[itemKey]);
        })
      ) {
        database[key].forEach((item) => {
          item[itemKey] = Number(item[itemKey]);
        });
      }
    });
  }
});

module.exports = database;
```

## 서버 REST API 테스트 해보기

- http://localhost:4000/
- swagger, postman, web browser
- GET: http://localhost:4000/api/todo/
- GET: http://localhost:4000/api/todo/2
