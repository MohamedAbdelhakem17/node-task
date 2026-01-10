import nodemailer from "nodemailer";
import emailConfig from "../../config/email-config.js";

const transport = nodemailer.createTransport(emailConfig);

/**
 * Sends an email using Nodemailer.
 *
 * This utility function creates and sends an email using a nodemailer
 * Nodemailer transport. It supports sending HTML emails and returns
 * the result of the sending operation.
 *
 * @async
 * @function sendEmail
 *
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.message - HTML email content
 *
 * @returns {Promise<Object>} Nodemailer sendMail result object
 *
 * @throws {Error} Throws an error if sending the email fails
 */
const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: options.to,
    subject: options.subject,
    html: options.message,
  };

  const result = await transport.sendMail(mailOptions);

  return result;
};

export default sendEmail;
