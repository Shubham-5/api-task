const mongoose = require("mongoose");

function dbConnection() {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on("error", (err) => {
    console.log("err", err);
  });

  mongoose.connection.on("connected", (err, res) => {
    console.log("MongoDB connected successfully!");
  });
}

module.exports = { dbConnection };
