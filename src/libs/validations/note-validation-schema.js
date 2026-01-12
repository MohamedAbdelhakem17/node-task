import { check } from "express-validator";

import validatorMiddleware from "../../middlewares/validator.middleware.js";
import HTTP_STATUS from "../constants/http-status.constant.js";
import AppError from "../util/app-error.js";
import NotesModel from "./../../models/notes/notes.schema";

const createNoteValidator = [
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Note title is required.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Note title must be between 3 and 30 characters."),

  check("content")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Note content must be at most 500 characters."),

  validatorMiddleware,
];

const deleteNoteValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid note id format.")
    .custom(async (id, { req }) => {
      const note = await NotesModel.findById(id);

      if (!note) {
        throw new AppError(404, HTTP_STATUS.FAIL, "Note not found.");
      }

      if (note.owner.toString() !== req.user._id.toString()) {
        throw new AppError(
          403,
          HTTP_STATUS.FAIL,
          "You are not allowed to delete this note."
        );
      }

      return true;
    }),

  validatorMiddleware,
];

export { createNoteValidator, deleteNoteValidator };
