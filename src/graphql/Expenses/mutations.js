export const createExpense = /* GraphQL */ `
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
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
`;
export const updateExpense = /* GraphQL */ `
  mutation UpdateExpense($input: UpdateExpenseInput!) {
    updateExpense(input: $input) {
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
`;
export const deleteExpense = /* GraphQL */ `
  mutation DeleteExpense($input: DeleteExpenseInput!) {
    deleteExpense(input: $input) {
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
`;