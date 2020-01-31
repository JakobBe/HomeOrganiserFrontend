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
      allDay
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
