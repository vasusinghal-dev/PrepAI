import { useRef, useState } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.jsx";
import { useNavigate } from "react-router-dom";
import {
  validateResumeFile,
  validateForm,
  clearFieldError,
} from "../validations/home.validation.js";

const Home = () => {
  const [fileName, setFileName] = useState("");
  const { loading, handleGenerateReport } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [errors, setErrors] = useState({});
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      const validation = validateResumeFile(file);
      if (!validation.isValid) {
        setErrors({ resumeFile: validation.error });
        setFileName("");
        e.target.value = "";
        return;
      }
      setFileName(file.name);
      clearFieldError("resumeFile", errors, setErrors);
    } else {
      setFileName("");
    }
  };

  const handleGenerateReportButton = async () => {
    // Clear previous errors
    setErrors({});

    const resumeFile = resumeInputRef.current.files[0];

    // Validate form
    const validation = validateForm(
      jobDescription,
      selfDescription,
      resumeFile,
    );

    if (!validation.isValid) {
      setErrors(validation.errors);

      // Scroll to first error
      const firstErrorField = Object.keys(validation.errors)[0];
      if (firstErrorField === "jobDescription") {
        document.getElementById("jobDescription")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (firstErrorField === "resumeFile") {
        document.getElementById("resume")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (firstErrorField === "selfDescription") {
        document.getElementById("selfDescription")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    try {
      const report = await handleGenerateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      navigate(`/interview/${report._id}`);
    } catch (err) {
      console.log(err);
      setErrors({
        submit:
          err.response?.data?.message ||
          "Failed to generate report. Please try again.",
      });

      // Scroll to error message
      document.querySelector(".info-note")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  if (loading) {
    return (
      <main className="home">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Generating your personalized interview report...</p>
            <p className="loading-hint">This may take a few moments</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="home">
      <div className="container">
        <div className="hero-section">
          <div className="hero-header">
            <div className="hero-title-section">
              <h1 className="title">Interview Report Generator</h1>
              <p className="subtitle">
                Create comprehensive interview reports and personalized
                preparation plans
              </p>
            </div>
            <button
              className="view-reports-btn"
              onClick={() => navigate("/reports")}
            >
              <svg
                className="reports-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4v16h16" />
                <polyline points="4 15 9 10 13 14 20 7" />
              </svg>
              <span>View All Reports</span>
              <svg
                className="arrow-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="interview-input-group">
          <div className="left">
            <label htmlFor="jobDescription">
              Job Description
              <span className="label-hint">Required</span>
            </label>
            <textarea
              name="jobDescription"
              id="jobDescription"
              placeholder="Paste job description here..."
              spellCheck="false"
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                clearFieldError("jobDescription", errors, setErrors);
              }}
              className={errors.jobDescription ? "error" : ""}
            ></textarea>
            {errors.jobDescription && (
              <div className="error-message">{errors.jobDescription}</div>
            )}
          </div>
          <div className="right">
            <div className="input-group">
              <p>
                Resume / CV
                <small className="highlight">Optional but recommended</small>
              </p>
              <label
                className={`file-label ${fileName ? "has-file" : ""} ${errors.resumeFile ? "error" : ""}`}
                htmlFor="resume"
              >
                <svg
                  className="upload-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {fileName ? fileName : "Upload Resume (PDF)"}
                {fileName && <span className="file-badge">✓</span>}
              </label>
              <input
                hidden
                ref={resumeInputRef}
                type="file"
                name="resume"
                id="resume"
                accept=".pdf"
                onChange={handleFileChange}
              />
              {errors.resumeFile && (
                <div className="error-message">{errors.resumeFile}</div>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="selfDescription">
                Self Description
                <span className="label-hint">Optional</span>
              </label>
              <textarea
                name="selfDescription"
                id="selfDescription"
                placeholder="Tell us about your experience, skills, and background..."
                spellCheck="false"
                value={selfDescription}
                onChange={(e) => {
                  setSelfDescription(e.target.value);
                  if (
                    errors.resumeFile ===
                    "Either a Resume or Self Description is required"
                  ) {
                    clearFieldError("resumeFile", errors, setErrors);
                  }
                  clearFieldError("selfDescription", errors, setErrors);
                }}
                className={errors.selfDescription ? "error" : ""}
              ></textarea>
              {errors.selfDescription && (
                <div className="error-message">{errors.selfDescription}</div>
              )}
            </div>

            <div className={`info-note ${errors.submit ? "error-note" : ""}`}>
              <svg
                className="info-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>
                {errors.submit ||
                  "Either a Resume or Self Description is required to generate a personalized plan"}
              </span>
            </div>

            <button
              className="button primary-button"
              onClick={handleGenerateReportButton}
              disabled={loading}
            >
              <svg
                className="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              {loading ? "Generating..." : "Generate Interview Report"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
