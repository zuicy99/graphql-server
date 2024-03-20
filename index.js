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
