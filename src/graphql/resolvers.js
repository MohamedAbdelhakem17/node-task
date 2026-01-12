import AppError from "../libs/util/app-error.js";
import NotesModel from "../models/notes/notes.schema.js";

export const resolvers = {
  Query: {
    myNotes: async (_, __, context) => {
      if (!context)
        throw new AppError(401, HTTP_STATUS.FAIL, "You must be logged in");

      const notes = await NotesModel.find().sort({
        createdAt: -1,
      });
      return notes;
    },
  },
  Note: {
    owner: async (parent) => {
      return await UserModel.findById(parent.owner);
    },
  },
};
