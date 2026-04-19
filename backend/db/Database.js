const mongoose = require("mongoose");

const connectDatabase = () => {
  console.log("Connecting to Database:", process.env.DB_URL.split('@')[1]); // Log host only for privacy
  mongoose
    .connect(process.env.DB_URL, {
        serverSelectionTimeoutMS: 5000,
    })
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error(`Database connection failed: ${err.message}`);
    });
};

module.exports = connectDatabase;