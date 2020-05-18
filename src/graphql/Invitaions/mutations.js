export const createInvitation = /* GraphQL */ `
  mutation CreateInvitation($input: CreateInvitationInput!) {
    createInvitation(input: $input) {
      id
      email
      status
      homeId
      creatorSub
    }
  }
`;
export const updateInvitation = /* GraphQL */ `
  mutation UpdateInvitation($input: UpdateInvitationInput!) {
    updateInvitation(input: $input) {
      id
      email
      status
      homeId
      creatorSub
      request
    }
  }
`;
export const deleteInvitation = /* GraphQL */ `
  mutation DeleteInvitation($input: DeleteInvitationInput!) {
    deleteInvitation(input: $input) {
      id
    }
  }
`;