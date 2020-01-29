export const createHome = /* GraphQL */ `
  mutation CreateHome(
      $name: String!,
      $createdAt: AWSTimestamp
      $updatedAt: AWSTimestamp
    ) {
    createHome(input: {
      name: $name, createdAt: $createdAt, updatedAt: $updatedAt
    }) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const updateHome = /* GraphQL */ `
  mutation UpdateHome($input: UpdateHomeInput!) {
    updateHome(input: $input) {
      id
      name
      users {
        nextToken
      }
      events {
        nextToken
      }
      expenses {
        id
        ammount
        userId
        homeId
        compensated
      }
      shoppingItems {
        id
        userId
        homeId
        price
        bought
        boughtBy
        name
        info
        createdAt
        updatedAt
      }
      toDos {
        id
        task
        userId
        done
        dueDate
        appointee
        homeId
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteHome = /* GraphQL */ `
  mutation DeleteHome($input: DeleteHomeInput!) {
    deleteHome(input: $input) {
      id
      name
      users {
        nextToken
      }
      events {
        nextToken
      }
      expenses {
        id
        ammount
        userId
        homeId
        compensated
      }
      shoppingItems {
        id
        userId
        homeId
        price
        bought
        boughtBy
        name
        info
        createdAt
        updatedAt
      }
      toDos {
        id
        task
        userId
        done
        dueDate
        appointee
        homeId
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;