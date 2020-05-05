export const listExpensesWithHomeId = /* GraphQL */`
  query listExpenses($homeId: ID) {
    listExpenses(filter: { homeId: { eq: $homeId } }){
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
    }
  }
`

export const getExpense = /* GraphQL */ `
  query GetExpense($id: ID!) {
    getExpense(id: $id) {
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
export const listExpenses = /* GraphQL */ `
  query ListExpenses(
    $filter: TableExpenseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listExpenses(filter: $filter, limit: $limit, nextToken: $nextToken) {
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