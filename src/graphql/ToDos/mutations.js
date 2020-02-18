export const createToDo = /* GraphQL */ `
  mutation CreateToDo($input: CreateToDoInput!) {
    createToDo(input: $input) {
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
export const updateToDo = /* GraphQL */ `
  mutation UpdateToDo($input: UpdateToDoInput!) {
    updateToDo(input: $input) {
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
export const deleteToDo = /* GraphQL */ `
  mutation DeleteToDo($input: DeleteToDoInput!) {
    deleteToDo(input: $input) {
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