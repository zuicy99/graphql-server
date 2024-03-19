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
- routes 폴더 생성 /
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

## 서버 REST API 테스트 해보기

- http://localhost:4000
- get http://localhost:4000/api/todo/
- get http://localhost:4000/api/todo/2
-
