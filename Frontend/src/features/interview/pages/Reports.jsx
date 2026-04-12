import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview.jsx";
import "../style/reports.scss";

const Reports = () => {
  const { reports, loading, handleGetReports, handleDeleteReportById } =
    useInterview();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterScore, setFilterScore] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    handleGetReports();
  }, []);

  const handleDeleteClick = async (interviewId, event) => {
    event.stopPropagation();

    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this report? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeletingId(interviewId);
      await handleDeleteReportById(interviewId);
      // Refresh the reports list after deletion
      await handleGetReports();
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Failed to delete report. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReports = reports?.filter((report) => {
    const matchesSearch = report.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterScore === "all" ||
      (filterScore === "high" && report.matchScore >= 80) ||
      (filterScore === "medium" &&
        report.matchScore >= 60 &&
        report.matchScore < 80) ||
      (filterScore === "low" && report.matchScore < 60);
    return matchesSearch && matchesFilter;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "No job description available";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <main className="reports-loading">
        <div className="loading-spinner"></div>
        <p>Loading your reports...</p>
      </main>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-container">
        {/* Header Section */}
        <div className="reports-header">
          <div className="header-content">
            <h1 className="reports-title">
              <span className="title-icon">📋</span>
              Your Interview Reports
            </h1>
            <p className="reports-subtitle">
              View and manage all your generated interview preparation reports
            </p>
          </div>
          <button className="new-report-btn" onClick={() => navigate("/")}>
            <svg
              className="plus-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Generate New Report
          </button>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="search-box">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterScore === "all" ? "active" : ""}`}
              onClick={() => setFilterScore("all")}
            >
              All Reports
            </button>
            <button
              className={`filter-btn ${filterScore === "high" ? "active" : ""}`}
              onClick={() => setFilterScore("high")}
            >
              High Score (80%+)
            </button>
            <button
              className={`filter-btn ${filterScore === "medium" ? "active" : ""}`}
              onClick={() => setFilterScore("medium")}
            >
              Medium Score (60-79%)
            </button>
            <button
              className={`filter-btn ${filterScore === "low" ? "active" : ""}`}
              onClick={() => setFilterScore("low")}
            >
              Low Score (&lt;60%)
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        {filteredReports && filteredReports.length > 0 && (
          <div className="stats-summary">
            <div className="stat-card">
              <span className="stat-value">{filteredReports.length}</span>
              <span className="stat-label">Reports Found</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">
                {Math.round(
                  filteredReports.reduce(
                    (acc, r) => acc + (r.matchScore || 0),
                    0,
                  ) / filteredReports.length,
                )}
                %
              </span>
              <span className="stat-label">Average Score</span>
            </div>
          </div>
        )}

        {/* Reports Grid */}
        {filteredReports && filteredReports.length > 0 ? (
          <div className="reports-grid">
            {filteredReports.map((report, index) => (
              <div
                key={report._id || index}
                className="report-card"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <div className="report-card-header">
                  <div className="report-title-section">
                    <h3 className="report-title">{report.title}</h3>
                    <span className="report-date">
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                  <div
                    className="report-score"
                    style={{ color: getScoreColor(report.matchScore) }}
                  >
                    <span className="score-value">
                      {report.matchScore || 0}%
                    </span>
                    <span className="score-label">
                      {getScoreLabel(report.matchScore || 0)}
                    </span>
                  </div>
                </div>

                <div className="report-card-body">
                  <p className="report-description">
                    {truncateText(report.jobDescription)}
                  </p>
                </div>

                <div className="report-card-footer">
                  <div className="report-meta">
                    <span className="meta-icon">📅</span>
                    <span className="meta-text">
                      {new Date(report.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="report-actions">
                    <button
                      className="view-report-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/interview/${report._id}`);
                      }}
                    >
                      View Report
                      <svg
                        className="arrow-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                    <button
                      className="delete-report-btn"
                      onClick={(e) => handleDeleteClick(report._id, e)}
                      disabled={deletingId === report._id}
                    >
                      {deletingId === report._id ? (
                        <>
                          <div className="delete-spinner"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg
                            className="delete-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">📭</span>
              <h3>No reports found</h3>
              <p>
                {searchTerm || filterScore !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't generated any interview reports yet"}
              </p>
              {!searchTerm && filterScore === "all" && (
                <button
                  className="generate-first-btn"
                  onClick={() => navigate("/")}
                >
                  Generate Your First Report
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
