require("dotenv").config();
const app = require("./src/app.js");
const connectToDB = require("./src/config/database.js");
const generateInterviewReport = require("./src/services/ai.service.js");

// generateInterviewReport({ resume, jobDescription, selfDescription });

connectToDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () =>
      console.log("Server running on http://localhost:3000"),
    );
  })
  .catch((err) => {
    console.log("Database cannot be connected", err);
  });
