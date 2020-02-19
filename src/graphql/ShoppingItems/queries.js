export const listShoppingItemsWithHomeId = /* GraphQL */`
  query listShoppingItems($homeId: ID, $boughtBy: ID $limit: Int) {
    listShoppingItems(filter: { homeId: { eq: $homeId }, boughtBy: { eq: $boughtBy } }, limit: $limit){
      items {
        id
        name
        price
        bought
        boughtBy
        inShoppingCart
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
      inShoppingCart
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
        inShoppingCart
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