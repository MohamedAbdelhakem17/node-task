import NotesModel from "../models/notes/notes.schema.js";
import UserModel from "../models/user/user.schema.js";

/* =======================  Resolvers ====================== */
export const resolvers = {
  Query: {
    myNotes: async (_, args, context) => {
      if (!context?.user)
        throw new AppError(401, "FAIL", "You must be logged in");

      const { userId, title, from, to, page = 1, limit = 10 } = args;

      const filter = {};

      /* ===== Filter by Owner ===== */
      // if (userId) {
      //   filter.owner = userId;
      // }

      /* ===== Filter by Title ===== */
      if (title) {
        filter.title = { $regex: title, $options: "i" };
      }

      /* ===== Filter by Date Interval ===== */
      if (from || to) {
        filter.createdAt = {};
        if (from) filter.createdAt.$gte = new Date(from);
        if (to) filter.createdAt.$lte = new Date(to);
      }

      const skip = (page - 1) * limit;

      /* ===== Query DB ===== */
      const [notes, total] = await Promise.all([
        NotesModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        NotesModel.countDocuments(filter),
      ]);
      const data = await NotesModel.find();
      console.log(filter);
      return {
        data: notes,
        meta: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    },
  },

  Note: {
    owner: async (parent) => {
      return await UserModel.findById(parent.owner);
    },
  },
};
