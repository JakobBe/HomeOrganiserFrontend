export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      sub
      homeId
      color
      paypalLink
      imageUrl
      createdAt
      updatedAt
    }
  }
`;

export const getUserBySub = /* GraphQL */ `
  query getUserBySub($sub: String!) {
    listUsers(filter: { sub: { eq: $sub } }){
      items {
        id
        homeId
        name
        color
        paypalLink
      }
    }
  }
`
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: TableUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        sub
        homeId
        color
        paypalLink
        imageUrl
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;