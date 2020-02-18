export const listToDosWithHomeId = /* GraphQL */`
  query listToDos($homeId: ID) {
    listToDos(filter: { homeId: { eq: $homeId } }){
      items {
        id
        task
        done
        userId
        homeId
        appointee
        dueDate
        createdAt
        updatedAt
      }
    }
  }
`

export const getToDo = /* GraphQL */ `
  query GetToDo($id: ID!) {
    getToDo(id: $id) {
      id
      task
      done
      userId
      homeId
      appointee
      dueDate
      createdAt
      updatedAt
    }
  }
`;
export const listToDos = /* GraphQL */ `
  query ListToDos(
    $filter: TableToDoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listToDos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        task
        done
        userId
        homeId
        appointee
        dueDate
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;