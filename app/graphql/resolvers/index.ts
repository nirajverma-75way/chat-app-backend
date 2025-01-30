import { prisma } from '../prismaClient';
import { PubSub } from 'graphql-subscriptions';
import bcrypt from 'bcrypt';
import { createUserTokens } from '../../common/services/passport-jwt.service';

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    getUsers: async (_: any) => {
      return await prisma.user.findMany({});
    },
    getUserById: async (_: any, { id }: { id: string }) => {
      return await prisma.user.findUnique({ where: { id } });
    },
    getMessages: async (_: any, { senderId, receiverId }: { senderId: string, receiverId: string }) => {
      return await prisma.message.findMany({
        where: {
          senderId,
          receiverId
        }
      });
    },
  },

  Mutation: {
    createUser: async (_: any, { name, email, password }: { name: string, email: string, password: string }) => {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });
      return user;
    },
    login: async (
      _: any,
      { email, password }: { email: string, password: string }
    ) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('User not found');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error('Invalid credentials');
      const { accessToken, refreshToken } = createUserTokens(user);
      user.refreshToken = refreshToken;
      await prisma.user.update({
        where: { id: user.id },
        data: {refreshToken: refreshToken},
      })
      return {
        accessToken,
        refreshToken,
        user,
      };
    },
    sendMessage: async (_: any, { senderId, receiverId, content }: { senderId: string, receiverId: string, content: string }) => {
      const message = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content,
        },
      });

      pubsub.publish('NEW_MESSAGE', { newMessage: message });
      return message;
    },
  },

  Subscription: {
    newMessage: {
      subscribe: () => pubsub.subscribe('NEW_MESSAGE', (message) => message),
    },
    userOnlineStatus: {
      subscribe: () => pubsub.subscribe('USER_ONLINE_STATUS', (status) => status),
    },
  },
};
