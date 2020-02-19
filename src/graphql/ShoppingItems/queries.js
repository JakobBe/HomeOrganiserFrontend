export const listShoppingItemsWithHomeId = /* GraphQL */`
  query listShoppingItems($homeId: ID) {
    listShoppingItems(filter: { homeId: { eq: $homeId } }){
      items {
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
  }
`

export const getShoppingItem = /* GraphQL */ `
  query GetShoppingItem($id: ID!) {
    getShoppingItem(id: $id) {
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
export const listShoppingItems = /* GraphQL */ `
  query ListShoppingItems(
    $filter: TableShoppingItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listShoppingItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;