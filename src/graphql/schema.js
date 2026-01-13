import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

import { resolvers } from "./resolvers.js";

/* =======================  User Type ======================= */
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
    fullname: { type: GraphQLString },
    email: { type: GraphQLString },
    profilePic: { type: GraphQLString },
  }),
});

/* ======================= Note Type ======================= */
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

/* ======================= Pagination Meta ====================== */
const PaginationMetaType = new GraphQLObjectType({
  name: "PaginationMeta",
  fields: () => ({
    page: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    total: { type: GraphQLInt },
    pages: { type: GraphQLInt },
  }),
});

/* ======================= Notes Response ======================= */
const NotesResponseType = new GraphQLObjectType({
  name: "NotesResponse",
  fields: () => ({
    data: { type: new GraphQLList(NoteType) },
    meta: { type: PaginationMetaType },
  }),
});

/* ======================= Root Query ======================= */
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    myNotes: {
      type: NotesResponseType,
      args: {
        userId: { type: GraphQLID },
        title: { type: GraphQLString },
        from: { type: GraphQLString },
        to: { type: GraphQLString },
        page: { type: GraphQLInt },
        limit: { type: GraphQLInt },
      },
      resolve: resolvers.Query.myNotes,
    },
  },
});

/* ======================= Schema ======================= */
export const schema = new GraphQLSchema({
  query: RootQuery,
});
