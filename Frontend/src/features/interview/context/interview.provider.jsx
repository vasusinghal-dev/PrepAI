import { useState } from "react";
import { InterviewContext } from "./interview.context.jsx";

export const InterviewProvider = ({ children }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  return (
    <InterviewContext.Provider
      value={{ report, setReport, reports, setReports, loading, setLoading }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
