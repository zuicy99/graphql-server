# GraphQL

- https://graphql.org/
- https://graphql-kr.github.io/

## Apollo Server

- Apollo Client 까지 제공합니다.
- React, Vue, Angula, Svelet ...
- 백엔드 API 구축

## Apollo Server 프로젝트 생성

- `npm init`
- package.json 추가

```json
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  },
```

## 필요 모듈 설치

- `npm install -g nodemon`
- `npm i convert-csv-to-json`
- `npm i graphql apollo-server`

## 필요 소스 작성

- /data 폴더 / todos.csv

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

- index.js 파일생성

```js
const database = require("./database");
console.log(database);
```

- index.js 테스트 후 내용추가

```js
// database.js 파일을 불러들여라
const database = require("./database");
// graphQL 의 쿼리 서비스를 제공하는 백엔드 API 서버기능
// ApolloServer 모듈과, gql 즉 gpl 문법을 위한 모듈활용
// AplooServer 에서는 gql 을 통해서 읽고, 쓰기 구성을 한다.
const { ApolloServer, gql } = require("apollo-server");

// js 로 만들어진 서버이므로 js 문법을 따름
// gpl 템플릿 문법 : Styled 또는 백틱 문법 보셨던 내용
// 백틱이라고 하지만 tagged template literal 문법 이름

// gql 은 스키마(데이터의 타입) 를 정의한다.
// type 은 TS 처럼 생각하면 됩니다.
// Graph QL 데이터 종류 명세서
// 타입 생성시 gql 을 사용한다.
// Query 는 데이터를 호출하는 용도입니다. (GET)
// 배열을 리턴한다 [결과객체는 Todo 타입]

// 리턴하는 데이터 이름 Todo
// 모양
const typeDefs = gql`
  type Query {
    todos: [Todo]
  }
  type Todo {
    id: Int
    title: String
    date: String
    complete: Boolean
    weather: Int
  }
`;
// 액션(실행해서 결과를 반영하는)들을 함수로 지정한다.
// 요청이 들어오면 데이터를 반환, 입력, 수정, 삭제
// JS 의 함수 형태로 정의하시면 됩니다.
// Query : 데이터 읽기
// Mutation : 쓰기, 지우기, 업데이트
const resolvers = {
  Query: {
    todos: () => database.todos,
  },
};
// 서버 인스턴스를 생성(매개변수로 타입정의, 결과요청 및 처리함수)
const server = new ApolloServer({ typeDefs, resolvers });

// 서버가 실행이 되고 listen 은 요청을 대기하는 상태로 진입
server.listen().then(({ url }) => {
  // 실제로 성공 로그 console 로 터미널 출력
  console.log(`🚀  Server ready at ${url}`);
});
```

- database.js 파일 생성

```js
// 실제 DB 활용시 교체 대상
// 임시로 csv 파일을 활용 모듈 설치
const csvToJson = require("convert-csv-to-json");
// 위에서 불러들인 csv 내용을 보관할 배열
const database = {
  todos: [],
};

// 객체의 key 를 파악해서 반복하는 코드
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
// 외부에서 사용할 수 있도록 외부노출
module.exports = database;
```

- 테스트
  `npm start`

- 쿼리 테스트

```json
query {
  todos {
    title,
    weather
  }
}
```

## 쿼리 추가

- 매개변수 전달해서 자료 리턴 되는 Query 추가

```js
const typeDefs = gql`
  type Query {
    todos: [Todo]
    // 추가된 내용
    todo(id: Int): Todo
  }
  type Todo {
    id: Int
    title: String
    date: String
    complete: Boolean
    weather: Int
  }
`;
```

```js
const resolvers = {
  Query: {
    todos: () => database.todos,
    // 추가된 Resolver
    todo: (parent, args, context, info) =>
      database.todos.filter((item) => {
        return item.id === args.id;
      })[0],
  },
};
```

- 쿼리 실행

```txt
query {
  todo(id:1) {
    title,
    weather,
    date
  }
}
```

## Mutation 전체코드

```js
// database.js 파일을 불러들여라
const database = require("./database");
// graphQL 의 쿼리 서비스를 제공하는 백엔드 API 서버기능
// ApolloServer 모듈과, gql 즉 gpl 문법을 위한 모듈활용
// AplooServer 에서는 gql 을 통해서 읽고, 쓰기 구성을 한다.
const { ApolloServer, gql } = require("apollo-server");

// js 로 만들어진 서버이므로 js 문법을 따름
// gpl 템플릿 문법 : Styled 또는 백틱 문법 보셨던 내용
// 백틱이라고 하지만 tagged template literal 문법 이름

// gql 은 스키마(데이터의 타입) 를 정의한다.
// type 은 TS 처럼 생각하면 됩니다.
// Graph QL 데이터 종류 명세서
// 타입 생성시 gql 을 사용한다.
// Query 는 데이터를 호출하는 용도입니다. (GET)
// 배열을 리턴한다 [결과객체는 Todo 타입]

// 리턴하는 데이터 이름 Todo
// 모양
const typeDefs = gql`
  type Query {
    todos: [Todo]
    todo(id: Int): Todo
  }
  type Mutation {
    deleteTodo(id: Int): Todo
    addTodo(
      id: Int
      title: String
      date: String
      complete: Boolean
      weather: Int
    ): Todo
    updateTodo(
      id: Int
      title: String
      date: String
      complete: Boolean
      weather: Int
    ): Todo
  }

  type Todo {
    id: Int
    title: String
    date: String
    complete: Boolean
    weather: Int
  }
`;
// 액션(실행해서 결과를 반영하는)들을 함수로 지정한다.
// 요청이 들어오면 데이터를 반환, 입력, 수정, 삭제
// JS 의 함수 형태로 정의하시면 됩니다.
// Query : 데이터 읽기
// Mutation : 쓰기, 지우기, 업데이트
const resolvers = {
  // 읽기
  Query: {
    todos: () => database.todos,
    todo: (parent, args, context, info) =>
      database.todos.filter((item) => {
        return item.id === args.id;
      })[0],
  },
  // 쓰기, 삭제, 업데이트
  Mutation: {
    // id를 활용한 삭제 기능
    deleteTodo: (parent, args, context, info) => {
      const deleted = database.todos.filter((item) => {
        return item.id === args.id;
      })[0];
      // 자동 업데이트가 안되므로 직접 변경
      database.todos = database.todos.filter((item) => {
        // 전달된 id 와 다른 것들만 모아서 다시 담는다.
        return item.id !== args.id;
      });
      // 삭제된
      return deleted;
    },
    // 추가
    addTodo: (parent, args, context, info) => {
      // id 는 자동 증가
      const data = { ...args, id: database.todos.length };
      database.todos.push(data);
      return args;
    },
    updateTodo: (parent, args, context, info) => {
      // args.id를 이용해서 찾아서 고친다.
      // 함수를 연결해서 다시 함수를 실행한다.
      // 메서드를 연결해서 다시 메서드를 실행한다.
      // 메서드 체이닝 이 뭘까요?
      return database.todos
        .filter((item) => {
          return item.id === args.id;
        })
        .map((item) => {
          // 각각의 속성에 리턴된 결과를 적용
          Object.assign(item, args);
          return item;
        })[0];
    },
  },
};
// 서버 인스턴스를 생성(매개변수로 타입정의, 결과요청 및 처리함수)
const server = new ApolloServer({ typeDefs, resolvers });

// 서버가 실행이 되고 listen 은 요청을 대기하는 상태로 진입
server.listen().then(({ url }) => {
  // 실제로 성공 로그 console 로 터미널 출력
  console.log(`🚀  Server ready at ${url}`);
});
```

## Mutation 실행하기

```txt
mutation {
  deleteTodo(id:1) {
    id,
    title,
    date
  }
}
mutation {
  addTodo(title:"반가워요", complete:false, date:"2024-03-20", weather:5) {
    title,
    id,
    weather
  }
}
mutation {
  updateTodo(id:3, title:"수정함", complete:true, date:"2024-03-20",weather:100) {
    title,
    date,
    weather
  }
}
```
