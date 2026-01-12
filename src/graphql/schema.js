// schema.js
import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

import { resolvers } from "./resolvers.js";

// User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
    fullname: { type: GraphQLString },
    email: { type: GraphQLString },
    profilePic: { type: GraphQLString },
  }),
});

// Note Type
const NoteType = new GraphQLObjectType({
  name: "Note",
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    owner: { type: UserType },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    myNotes: {
      type: new GraphQLList(NoteType),
      resolve: resolvers.Query.myNotes,
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
});
