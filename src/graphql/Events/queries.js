export const listEventsWithHomeId = /* GraphQL */`
  query listEvents($homeId: ID) {
    listEvents(filter: { homeId: { eq: $homeId } }){
      items {
        id
        text
        userId
        homeId
        date
        allDay
        time
      }
    }
  }
`

export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      date
      userId
      text
      homeId
      userName
      time
      allDay
      createdAt
      updatedAt
    }
  }
`;
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $filter: TableEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;