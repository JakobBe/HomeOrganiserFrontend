export const createShoppingItem = /* GraphQL */ `
  mutation CreateShoppingItem($input: CreateShoppingItemInput!) {
    createShoppingItem(input: $input) {
      id
      name
      price
      bought
      boughtBy
      info
      userId
      homeId
      createdAt
      updatedAt
    }
  }
`;
export const updateShoppingItem = /* GraphQL */ `
  mutation UpdateShoppingItem($input: UpdateShoppingItemInput!) {
    updateShoppingItem(input: $input) {
      id
      name
      price
      bought
      boughtBy
      info
      userId
      homeId
      createdAt
      updatedAt
    }
  }
`;
export const deleteShoppingItem = /* GraphQL */ `
  mutation DeleteShoppingItem($input: DeleteShoppingItemInput!) {
    deleteShoppingItem(input: $input) {
      id
      name
      price
      bought
      boughtBy
      info
      userId
      homeId
      createdAt
      updatedAt
    }
  }
`;