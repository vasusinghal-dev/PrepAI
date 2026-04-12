import "./components.scss";

const TechnicalQuestions = ({ questions }) => {
  return (
    <div className="questions-container">
      <div className="questions-header">
        <p className="subtitle">
          Prepare with these technical questions based on your job description
        </p>
      </div>
      <div className="questions-list">
        {questions.map((q, index) => (
          <div key={q.question} className="question-card">
            <div className="question-number">#{index + 1}</div>
            <div className="question-content">
              <h3 className="question-text">{q.question}</h3>
              <div className="intention-section">
                <span className="intention-label">
                  🎯 Interviewer's Intention:
                </span>
                <p className="intention-text">{q.intention}</p>
              </div>
              <div className="answer-section">
                <span className="answer-label">💡 Suggested Answer:</span>
                <p className="answer-text">{q.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalQuestions;
