export const getHome2 = /* GraphQL */ `
  query GetHome($id: ID!) {
    getHome(id: $id) {
      id
      name
      users {
        items {
          id
          name
        }
        nextToken
      }
      events {
        items {
          id
          text
          date
          userId
        }
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
export const listHomes = /* GraphQL */ `
  query ListHomes(
    $filter: TableHomeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHomes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;