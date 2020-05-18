export const getHome2 = /* GraphQL */ `
  query GetHome($id: ID! $invitationFilter: TableInvitationFilterInput) {
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
      invitations(filter: $invitationFilter) {
        items {
          id
          email
          homeId
          status
          request
          creatorSub
          createdAt
          updatedAt
        }
      }
      events(limit: 100) {
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
        items {
          id
          ammount
          userId
          homeId
          shoppingItems {
            items {
              id
            }
          }
          accountableUsers {
            items {
              id
            }
          }
          compensated
          info
          createdAt
          updatedAt
        }
        nextToken
      }
      shoppingItems(limit: 100) {
        items {
          id
          userId
          homeId
          price
          bought
          inShoppingCart
          boughtBy
          name
          info
          createdAt
          updatedAt
        }
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