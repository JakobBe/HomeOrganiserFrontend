export const createUser = /* GraphQL */ `
  mutation CreateUser(
      $name: String!,
      $sub: String!,
      $homeId: ID!,
      $color: String!,
      $paypalLink: String
      $createdAt: String!,
      $updatedAt: String!
    ) {
    createUser(input: {
        name: $name, sub: $sub, homeId: $homeId, color: $color, createdAt: $createdAt, updatedAt: $updatedAt, paypalLink: $paypalLink
    })
    {
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

export const createUser2 = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
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