import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    online: Boolean!
    refreshToken: String
  }

  type Message {
    id: ID!
    senderId: ID!
    receiverId: ID!
    content: String
    mediaUrl: String
    status: Status
    read: Boolean!
    timestamp: String
  }

  type AuthParam{
    accessToken: String!
    refreshToken: String! 
    user: User!
  }


  enum Status {
    UNDELIVERED
    DELIVERED
  }

  type Query {
    getUsers: [User]
    getUserById(id: ID!): User
    login(email: String!, password: String! ): AuthParam!
    getMessages(senderId: ID!, receiverId: ID!): [Message]
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): String
    sendMessage(senderId: ID!, receiverId: ID!, content: String, mediaUrl: String): Message
    updateStatus(messageId: ID!, status: Status!): Message
  }

  type Subscription {
    newMessage(receiverId: ID!): Message
    userOnlineStatus(userId: ID!): User
  }
`;
