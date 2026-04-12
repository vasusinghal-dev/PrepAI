import { useEffect, useState } from "react";
import "../style/interview.scss";
import TechnicalQuestions from "../components/TechnicalQuestions.jsx";
import BehavioralQuestions from "../components/BehavioralQuestions.jsx";
import RoadMap from "../components/RoadMap.jsx";
import Overview from "../components/Overview.jsx";
import { useInterview } from "../hooks/useInterview.jsx";
import { useParams } from "react-router-dom";
import { RiSparklingFill } from "react-icons/ri";

const Interview = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { report, loading, handleGetReportById, handleGenerateResumePdf } =
    useInterview();
  const { interviewId } = useParams();
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    if (interviewId) {
      handleGetReportById(interviewId);
    }
  }, [interviewId]);

  const handleDownloadResume = async () => {
    if (!report?.resume && !report?.selfDescription) {
      alert("No resume or self description available to generate PDF");
      return;
    }

    setDownloadingPdf(true);
    try {
      await handleGenerateResumePdf(interviewId);
    } catch (error) {
      console.error("Download error:", error);
      alert(error.message || "Failed to generate resume PDF");
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading || !report) {
    return (
      <main className="interview-loading">
        <div className="loading-spinner"></div>
        <p>Loading your interview report...</p>
      </main>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            jobDescription={report.jobDescription}
            resume={report.resume}
            selfDescription={report.selfDescription}
          />
        );
      case "technical":
        return <TechnicalQuestions questions={report.technicalQuestions} />;
      case "behavioral":
        return <BehavioralQuestions questions={report.behavioralQuestions} />;
      case "roadmap":
        return (
          <RoadMap
            preparationPlan={report.preparationPlan}
            matchScore={report.matchScore}
          />
        );
      default:
        return (
          <Overview
            jobDescription={report.jobDescription}
            resume={report.resume}
            selfDescription={report.selfDescription}
          />
        );
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="interview-dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">Interview Prep</span>
          </div>
          <ul className="nav-links">
            <li
              className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-label">Overview</span>
            </li>
            <li
              className={`nav-item ${activeTab === "technical" ? "active" : ""}`}
              onClick={() => setActiveTab("technical")}
            >
              <span className="nav-icon">💻</span>
              <span className="nav-label">Technical Questions</span>
            </li>
            <li
              className={`nav-item ${activeTab === "behavioral" ? "active" : ""}`}
              onClick={() => setActiveTab("behavioral")}
            >
              <span className="nav-icon">🗣️</span>
              <span className="nav-label">Behavioral Questions</span>
            </li>
            <li
              className={`nav-item ${activeTab === "roadmap" ? "active" : ""}`}
              onClick={() => setActiveTab("roadmap")}
            >
              <span className="nav-icon">🗺️</span>
              <span className="nav-label">Road Map</span>
            </li>
          </ul>

          {/* Download Resume Button - Below Road Map Tab */}
          <div className="nav-download-section">
            <button
              className="nav-download-btn"
              onClick={handleDownloadResume}
              disabled={downloadingPdf}
            >
              {downloadingPdf ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <RiSparklingFill className="ai-icon" />
                  <span>Download AI Generated Resume</span>
                  <svg
                    className="arrow-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-header">
          <h1>
            {activeTab === "overview" && "Data Overview"}
            {activeTab === "technical" && "Technical Questions"}
            {activeTab === "behavioral" && "Behavioral Questions"}
            {activeTab === "roadmap" && "Your Learning Roadmap"}
          </h1>
        </div>
        <div className="content-body">{renderContent()}</div>
      </main>

      <aside className="skill-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-icon">⚠️</span>
          <h3>Skill Gaps</h3>
        </div>

        <div className="match-score-card">
          <div className="match-score-header">
            <span className="match-score-icon">📊</span>
            <span className="match-score-title">Overall Match</span>
          </div>
          <div
            className="match-score-value"
            style={{ color: getScoreColor(report.matchScore) }}
          >
            {report.matchScore}%
          </div>
          <div className="match-score-progress">
            <div
              className="match-score-progress-bar"
              style={{
                width: `${report.matchScore}%`,
                backgroundColor: getScoreColor(report.matchScore),
              }}
            />
          </div>
          <div className="match-score-message">
            {report.matchScore >= 80
              ? "🎉 Great match! Focus on skill gaps to excel."
              : report.matchScore >= 60
                ? "📈 Good foundation. Bridge the gaps for better opportunities."
                : "💪 Need improvement. Follow the roadmap to level up."}
          </div>
        </div>

        <div className="skill-list">
          {report.skillGaps?.map((skill) => (
            <div key={skill.skill || skill.id} className="skill-tag">
              <span className="skill-name">{skill.skill || skill.name}</span>
              <span
                className={`skill-severity ${(skill.severity || "").toLowerCase()}`}
              >
                {skill.severity}
              </span>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <p>💡 Focus on high-priority gaps first</p>
        </div>
      </aside>
    </div>
  );
};

export default Interview;
