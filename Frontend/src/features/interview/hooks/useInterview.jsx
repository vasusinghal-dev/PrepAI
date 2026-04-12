import {
  generateInterviewReport,
  getInterviewReportById,
  getInterviewReports,
  deleteInterviewReportById,
  generateResumePdf,
} from "../services/interview.api.js";
import { useContext } from "react";
import { InterviewContext } from "../context/interview.context.jsx";

export const useInterview = () => {
  const { report, setReport, reports, setReports, loading, setLoading } =
    useContext(InterviewContext);

  const handleGenerateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    try {
      setLoading(true);

      const data = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      if (!data?.interviewReport) {
        throw new Error("Invalid report");
      }

      setReport(data.interviewReport);
      return data.interviewReport;
    } finally {
      setLoading(false);
    }
  };

  const handleGetReportById = async (interviewId) => {
    try {
      setLoading(true);

      const data = await getInterviewReportById(interviewId);
      if (!data) {
        throw new Error("Error while fetching report.");
      }

      setReport(data.interviewReport);
    } finally {
      setLoading(false);
    }
  };

  const handleGetReports = async () => {
    try {
      setLoading(true);

      const data = await getInterviewReports();

      if (!data) {
        throw new Error("Error while fetching reports.");
      }

      const reportsWithMeta = data.interviewReports.map((report) => ({
        ...report,
        createdAt: report.createdAt || new Date().toISOString(),
        matchScore: report.matchScore || 0,
      }));

      setReports(reportsWithMeta);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReportById = async (interviewId) => {
    try {
      setLoading(true);

      const data = await deleteInterviewReportById(interviewId);
      if (!data) {
        throw new Error("Error while deleting report.");
      }
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResumePdf = async (interviewId) => {
    const data = await generateResumePdf(interviewId);
    if (!data) {
      throw new Error("Error while generating resume pdf.");
    }

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `resume_${interviewId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return {
    report,
    reports,
    loading,
    handleGenerateReport,
    handleGetReportById,
    handleGetReports,
    handleDeleteReportById,
    handleGenerateResumePdf,
  };
};
