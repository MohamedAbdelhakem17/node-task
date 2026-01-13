import multer from "multer";

/**
 * Multer config for image uploads (memory storage).
 * @returns {import("multer").Multer}
 */
const multerOptions = () => {
  const storage = multer.memoryStorage();

  /** @type {import("multer").Options["fileFilter"]} */
  const fileFilter = (req, file, cb) =>
    file.mimetype.startsWith("image")
      ? cb(null, true)
      : cb(new Error("This is not an image"), false);

  return multer({ storage, fileFilter });
};

/**
 * Upload single image middleware
 * @param {string} imageKey
 */
export const uploadSingleImage = (imageKey) => multerOptions().single(imageKey);
