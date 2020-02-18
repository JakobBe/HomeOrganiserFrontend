export const getHome2 = /* GraphQL */ `
  query GetHome($id: ID!) {
    getHome(id: $id) {
      id
      name
      users {
        items {
          id
          name
          color
          sub
          imageUrl
        }
        nextToken
      }
      events {
        items {
          id
          text
          date
          allDay
          userId
          time
          endDate
          endTime
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
        items {
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