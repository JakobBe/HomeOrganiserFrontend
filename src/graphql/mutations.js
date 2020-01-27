/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createHome = /* GraphQL */ `
  mutation CreateHome($input: CreateHomeInput!) {
    createHome(input: $input) {
      id
      name
      users {
        nextToken
      }
      events {
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
      createdAt
      updatedAt
    }
  }
`;
export const updateHome = /* GraphQL */ `
  mutation UpdateHome($input: UpdateHomeInput!) {
    updateHome(input: $input) {
      id
      name
      users {
        nextToken
      }
      events {
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteHome = /* GraphQL */ `
  mutation DeleteHome($input: DeleteHomeInput!) {
    deleteHome(input: $input) {
      id
      name
      users {
        nextToken
      }
      events {
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
      createdAt
      updatedAt
    }
  }
`;
export const createUser = /* GraphQL */ `
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
export const createEvent = /* GraphQL */ `
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      date
      userId
      text
      homeId
      userName
      time
      createdAt
      updatedAt
    }
  }
`;
export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      id
      date
      userId
      text
      homeId
      userName
      time
      createdAt
      updatedAt
    }
  }
`;
export const deleteEvent = /* GraphQL */ `
  mutation DeleteEvent($input: DeleteEventInput!) {
    deleteEvent(input: $input) {
      id
      date
      userId
      text
      homeId
      userName
      time
      createdAt
      updatedAt
    }
  }
`;
