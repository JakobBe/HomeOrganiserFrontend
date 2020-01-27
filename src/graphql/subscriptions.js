/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateHome = /* GraphQL */ `
  subscription OnCreateHome(
    $id: ID
    $name: String
    $createdAt: AWSTimestamp
    $updatedAt: AWSTimestamp
  ) {
    onCreateHome(
      id: $id
      name: $name
      createdAt: $createdAt
      updatedAt: $updatedAt
    ) {
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
export const onUpdateHome = /* GraphQL */ `
  subscription OnUpdateHome(
    $id: ID
    $name: String
    $createdAt: AWSTimestamp
    $updatedAt: AWSTimestamp
  ) {
    onUpdateHome(
      id: $id
      name: $name
      createdAt: $createdAt
      updatedAt: $updatedAt
    ) {
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
export const onDeleteHome = /* GraphQL */ `
  subscription OnDeleteHome(
    $id: ID
    $name: String
    $createdAt: AWSTimestamp
    $updatedAt: AWSTimestamp
  ) {
    onDeleteHome(
      id: $id
      name: $name
      createdAt: $createdAt
      updatedAt: $updatedAt
    ) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $id: ID
    $name: String
    $sub: String
    $homeId: ID
    $color: String
  ) {
    onCreateUser(
      id: $id
      name: $name
      sub: $sub
      homeId: $homeId
      color: $color
    ) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $id: ID
    $name: String
    $sub: String
    $homeId: ID
    $color: String
  ) {
    onUpdateUser(
      id: $id
      name: $name
      sub: $sub
      homeId: $homeId
      color: $color
    ) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $id: ID
    $name: String
    $sub: String
    $homeId: ID
    $color: String
  ) {
    onDeleteUser(
      id: $id
      name: $name
      sub: $sub
      homeId: $homeId
      color: $color
    ) {
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
export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent(
    $id: ID
    $date: AWSDate
    $userId: ID
    $text: String
    $homeId: ID
  ) {
    onCreateEvent(
      id: $id
      date: $date
      userId: $userId
      text: $text
      homeId: $homeId
    ) {
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
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent(
    $id: ID
    $date: AWSDate
    $userId: ID
    $text: String
    $homeId: ID
  ) {
    onUpdateEvent(
      id: $id
      date: $date
      userId: $userId
      text: $text
      homeId: $homeId
    ) {
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
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent(
    $id: ID
    $date: AWSDate
    $userId: ID
    $text: String
    $homeId: ID
  ) {
    onDeleteEvent(
      id: $id
      date: $date
      userId: $userId
      text: $text
      homeId: $homeId
    ) {
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
