import asyncHandler from "express-async-handler";

import AppError from "../../libs/util/app-error.js";
import sendSuccess from "../../libs/util/send-success-response.js";
import HTTP_STATUS from "./../../libs/constants/http-status.constant.js";
import NotesModel from "./../../models/notes/notes.schema.js";

/**
 * Create a new note for the authenticated user
 *
 * @route POST /notes
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.body
 * @param {string} req.body.title - Note title
 * @param {string} req.body.content - Note content
 * @param {Object} req.user - Authenticated user
 * @param {string} req.user._id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} Success response with created note
 */
const createNotes = asyncHandler(async (req, res) => {
  // Get data
  const { title, content } = req.body;
  const owner = req.user._id;

  // Create new note
  const newNote = await NotesModel.create({ title, content, owner });

  // error case
  if (!newNote) {
    throw new AppError(
      500,
      HTTP_STATUS.FAIL,
      "Something went wrong, try again"
    );
  }

  // send success response
  sendSuccess(res, {
    statusCode: 201,
    message: "Note added successfully",
    data: newNote,
  });
});

/**
 * Delete a note owned by the authenticated user
 *
 * @route DELETE /notes/:id
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.params
 * @param {string} req.params.id - Note ID
 * @param {Object} req.user - Authenticated user
 * @param {string} req.user._id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} Success response
 */
const deleteNotes = asyncHandler(async (req, res) => {
  // Get data
  const { id } = req.params;
  const owner = req.user._id;

  const oldNote = await NotesModel.findOneAndDelete({
    _id: id,
    owner,
  });

  // If error in delete
  if (!oldNote) {
    throw new AppError(
      404,
      HTTP_STATUS.FAIL,
      "Note not found or not authorized"
    );
  }

  // send success response
  sendSuccess(res, {
    statusCode: 200,
    message: "Note deleted successfully",
    data: null,
  });
});

export { createNotes, deleteNotes };
