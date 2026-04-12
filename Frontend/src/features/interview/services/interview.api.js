import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

/**
 * @description Service to generate interview report based on user self description, resume, and job description.
 */
export const generateInterviewReport = async ({
  resumeFile,
  jobDescription,
  selfDescription,
}) => {
  try {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);

    const response = await api.post("/api/interview/generate-report", formData);

    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Something went wrong" };
  }
};

/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
  try {
    const response = await api.get(`/api/interview/report/${interviewId}`);

    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Something went wrong" };
  }
};

/**
 * @description Service to get all interview reports of logged in user.
 */
export const getInterviewReports = async () => {
  try {
    const response = await api.get("/api/interview/reports");

    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Something went wrong" };
  }
};

/**
 * @description Service to delete interview report by interviewId.
 */
export const deleteInterviewReportById = async (interviewId) => {
  try {
    const response = await api.delete(`/api/interview/report/${interviewId}`);

    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Something went wrong" };
  }
};

/**
 * @description Service to generate resume pdf by interviewId based on resume, self-description, and job-description
 */
export const generateResumePdf = async (interviewId) => {
  try {
    const response = await api.get(`/api/interview/resume/pdf/${interviewId}`, {
      responseType: "blob",
    });

    if (response.headers["content-type"] !== "application/pdf") {
      throw new Error("Invalid response format");
    }

    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Something went wrong" };
  }
};
