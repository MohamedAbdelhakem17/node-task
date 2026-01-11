import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "note title is required"],
      minlength: [3, "note title must be at least 3 characters"],
      maxlength: [30, "note title must be at most 30 characters"],
    },

    content: {
      type: String,
      trim: true,
      maxlength: [500, "note content must be at most 500 characters"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const NotesModel = mongoose.model("Note", NotesSchema);

export default NotesModel;
