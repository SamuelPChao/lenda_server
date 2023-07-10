const mongoose = require("mongoose");
require("dotenv").config({
  path: "./config.env",
});
const app = require("./app");
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.PASSWORD
);
mongoose.connect(DB).then((con) => {
  // console.log(con);
  console.log("DB Connection connected");
});
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("Sigterm received. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
