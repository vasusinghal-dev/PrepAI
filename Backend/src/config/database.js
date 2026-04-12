const mongoose = require("mongoose");

async function connectToDB(params) {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database");
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectToDB;
