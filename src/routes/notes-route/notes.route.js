import express from "express";

import {
  createNotes,
  deleteNotes,
} from "../../controller/notes-controller/notes.controller.js";

import protect from "../../middlewares/protect.middleware.js";

const router = express.Router();

router.post("/", protect, createNotes);
router.delete("/:id", protect, deleteNotes);

export default router;
