export const createUser = /* GraphQL */ `
  mutation CreateUser(
      $name: String!,
      $sub: String!,
      $homeId: String!,
      $color: String!,
    ) {
    createUser(name: $name, sub: $sub, homeId: $homeId, color: $color, name: $name, ) {
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