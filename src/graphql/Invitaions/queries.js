export const listPendingInvitationsWithHomeId = /* GraphQL */`
  query listInvitations($homeId: ID, $status: String) {
    listInvitations(filter: { homeId: { eq: $homeId }, status: { eq: $status }}){
      items {
        id
        email
        homeId
        status
        request
        creatorSub
        createdAt
        updatedAt
      }
    }
  }
`

export const getInvitation = /* GraphQL */ `
  query GetInvitation($id: ID!) {
    getInvitation(id: $id) {
      id
        email
        homeId
        status
        request
        creatorSub
        createdAt
        updatedAt
    }
  }
`;
export const listInvitations = /* GraphQL */ `
  query ListInvitations(
    $filter: TableInvitationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInvitations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        homeId
        status
        request
        creatorSub
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;