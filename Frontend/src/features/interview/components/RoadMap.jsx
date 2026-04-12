import "./components.scss";

const RoadMap = ({ preparationPlan, matchScore }) => {
  return (
    <div className="roadmap-container">
      <div className="roadmap-header">
        <p className="subtitle">
          Your personalized 30-day plan to bridge skill gaps
        </p>
        <div className="progress-indicator">
          <span>Target Completion: {matchScore}% → 95%+</span>
        </div>
      </div>
      <div className="timeline">
        {preparationPlan.map((item, index) => (
          <div key={item.day} className="timeline-item">
            <div className="timeline-marker">
              <div className="marker-dot"></div>
              {index < preparationPlan.length - 1 && (
                <div className="marker-line"></div>
              )}
            </div>
            <div className="timeline-content">
              <div className="day-badge">Day {item.day}</div>
              <h3 className="focus-title">{item.focus}</h3>
              <ul className="tasks-list">
                {item.tasks.map((task, i) => (
                  <li key={i} className="task-item">
                    <span className="task-bullet">✓</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadMap;
