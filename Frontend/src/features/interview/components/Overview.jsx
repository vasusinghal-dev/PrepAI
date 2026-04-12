import { useState } from "react";
import "./components.scss";

const Overview = ({ jobDescription, resume, selfDescription }) => {
  const [activeInfoTab, setActiveInfoTab] = useState("job"); // job, resume, self

  return (
    <div className="overview-container">
      <div className="overview-tabs">
        <button
          className={`overview-tab ${activeInfoTab === "job" ? "active" : ""}`}
          onClick={() => setActiveInfoTab("job")}
        >
          <span className="tab-icon">💼</span>
          Job Description
        </button>
        <button
          className={`overview-tab ${activeInfoTab === "resume" ? "active" : ""}`}
          onClick={() => setActiveInfoTab("resume")}
        >
          <span className="tab-icon">📄</span>
          Your Resume
        </button>
        <button
          className={`overview-tab ${activeInfoTab === "self" ? "active" : ""}`}
          onClick={() => setActiveInfoTab("self")}
        >
          <span className="tab-icon">💭</span>
          Self Description
        </button>
      </div>

      {activeInfoTab === "job" && (
        <div className="overview-content">
          <div className="info-card">
            <h3 className="info-title">
              <span className="info-icon">🎯</span>
              Role Requirements
            </h3>

            <div
              className="job-description"
              style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}
            >
              {jobDescription}
            </div>
          </div>
        </div>
      )}

      {activeInfoTab === "resume" && (
        <div className="overview-content">
          <div className="info-card">
            <h3 className="info-title">
              <span className="info-icon">📄</span>
              Your Resume Summary
            </h3>
            <div className="resume-content">
              {resume.split("\n").map((line, index) => {
                if (
                  line.includes("Summary") ||
                  line.includes("Skills") ||
                  line.includes("Projects") ||
                  line.includes("Education")
                ) {
                  return (
                    <h4 key={index} className="section-title">
                      {line.trim()}
                    </h4>
                  );
                } else if (line.startsWith("-")) {
                  return (
                    <li key={index} className="bullet-point">
                      {line.substring(1).trim()}
                    </li>
                  );
                } else if (line.trim() === "") {
                  return <br key={index} />;
                }
                return (
                  <p key={index} className="text-line">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeInfoTab === "self" && (
        <div className="overview-content">
          <div className="info-card">
            <h3 className="info-title">
              <span className="info-icon">💭</span>
              Your Self Introduction
            </h3>
            <div className="self-description">
              {selfDescription.split("\n").map((line, index) =>
                line.trim() === "" ? (
                  <br key={index} />
                ) : (
                  <p key={index} className="text-line">
                    {line}
                  </p>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
