const pdfParse = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service.js");
const interviewReportModel = require("../models/interview.model.js");

/**
 * @name generateInterviewReportController
 * @description Controller to generate interview report based on user self description, resume and job description.
 * @access private
 */
async function generateInterviewReportController(req, res) {
  try {
    let resumeText = null;

    if (req.file) {
      const resumeParsed = await new pdfParse.PDFParse(
        Uint8Array.from(req.file.buffer),
      ).getText();
      resumeText = resumeParsed.text;
    }

    const { selfDescription, jobDescription } = req.body;

    if (!resumeText && (!selfDescription || selfDescription.trim() === "")) {
      return res.status(400).json({
        message:
          "Either a Resume or Self Description is required to generate a personalized plan",
      });
    }

    if (!jobDescription || jobDescription.trim() === "") {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeText || "",
      selfDescription: selfDescription || "",
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText || "",
      selfDescription: selfDescription || "",
      jobDescription,
      ...interviewReportByAi,
    });

    res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (err) {
    console.error("ERROR:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
}

/**
 * @name getInterviewReportByIdController
 * @description Controller to get interview report by interviewId
 * @access private
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({ message: "Interview report not found." });
  }

  res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
}

/**
 * @name getAllInterviewReportsController
 * @description Controller to get all the interview reports of logged in user
 * @access private
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select("title jobDescription matchScore");

  if (!interviewReports) {
    return res.status(404).json({ message: "No reports generated yet." });
  }

  res.status(200).json({
    message: "All interview reports fetched successfully.",
    interviewReports,
  });
}

/**
 * @name deleteReportByIdController
 * @description Controller to delete interview reports by interviewId
 * @access private
 */
async function deleteReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message:
          "Interview report not found or you don't have permission to delete it.",
      });
    }

    await interviewReportModel.deleteOne({
      _id: interviewId,
      user: req.user.id,
    });

    res.status(200).json({
      message: "Interview report deleted successfully.",
      deletedReportId: interviewId,
    });
  } catch (err) {
    console.error("Error deleting report:", err);

    if (err.name === "CastError") {
      return res.status(400).json({
        message: "Invalid report ID format.",
      });
    }

    res.status(500).json({
      message: "Server error while deleting report.",
      error: err.message,
    });
  }
}

/**
 * @name generateResumePdfController
 * @description Controller to generate the resume pdf based on user self description, resume and job description.
 * @access private
 */
async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params;

    if (!interviewReportId) {
      return res.status(400).json({
        message: "Interview ID is required",
      });
    }

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewReportId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message:
          "Interview report not found or you don't have permission to access it.",
      });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    if (!resume && (!selfDescription || selfDescription.trim() === "")) {
      return res.status(400).json({
        message:
          "Cannot generate resume PDF: No resume or self description available",
      });
    }

    if (!jobDescription || jobDescription.trim() === "") {
      return res.status(400).json({
        message: "Cannot generate resume PDF: No job description available",
      });
    }

    const pdfBuffer = await generateResumePdf({
      resume: resume || "",
      selfDescription: selfDescription || "",
      jobDescription: jobDescription,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
      "Content-Length": pdfBuffer.length,
    });

    return res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error("ERROR in generateResumePdfController:", err);

    if (
      err.message === "Invalid JSON from AI" ||
      err.message === "Invalid AI structure"
    ) {
      return res.status(502).json({
        message: "Failed to generate resume PDF due to AI service error",
        error: err.message,
      });
    }

    if (err.message.includes("timeout") || err.message.includes("network")) {
      return res.status(504).json({
        message: "Request timeout while generating PDF",
        error: err.message,
      });
    }

    res.status(500).json({
      message: "Server error while generating resume PDF",
      error: err.message,
    });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  deleteReportByIdController,
  generateResumePdfController,
};
