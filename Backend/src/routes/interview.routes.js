const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const interviewController = require("../controllers/interview.controller.js");
const upload = require("../middlewares/file.middleware.js");

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/generate-report
 * @description generate new interview report on the basis of user self description, resume pdf, and job description.
 * @access private
 */
interviewRouter.post(
  "/generate-report",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.generateInterviewReportController,
);

/**
 * @route GET /api/inteview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
 */
interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController,
);

/**
 * @route GET /api/interview/reports
 * @description get all interview reports of logged in user
 * @access private
 */
interviewRouter.get(
  "/reports",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController,
);

/**
 * @route DELETE /api/interview/report/:interviewId
 * @description delete interview report by interviewId
 * @access private
 */
interviewRouter.delete(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.deleteReportByIdController,
);

/**
 * @route GET /api/interview/resume/pdf/:interviewReportId
 * @description generate the resume pdf based on user self description, resume and job description.
 * @access private
 */
interviewRouter.get(
  "/resume/pdf/:interviewReportId",
  authMiddleware.authUser,
  interviewController.generateResumePdfController,
);

module.exports = interviewRouter;
