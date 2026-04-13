require("dotenv").config();
const app = require("./src/app.js");
const connectToDB = require("./src/config/database.js");

const PORT = process.env.PORT || 3000;

connectToDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((err) => {
    console.log("Database cannot be connected", err);
  });
