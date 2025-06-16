"use strict";

require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const sequelize = require("./models/database.js");
const apiRoutes = require("./routes/api.js");

const app = express();
const PORT = process.env.APP_PORT;

app.use(cors());
app.use(express.json());

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Unable to connect to the database:", err));

sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Error syncing database:", err));

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/api", apiRoutes);

const server = app.listen(PORT, () => {
  console.log(
    `\n  \x1b[32m\u001b[1m>\u001b[0m  Backend:\x1b[36m http://localhost:\u001b[1m${PORT}\u001b[0m\x1b[36m/\u001b[0m\n`
  );
});

const cleanup = (exitCode) => {
  console.log("\n> Cleaning up before exit\n");

  sequelize
    .close()
    .then(() => console.log("Database connection closed"))
    .catch((err) => console.error("Error closing database connection:", err))
    .finally(() => {
      server.close(() => {
        console.log("Server closed");
        process.exit(exitCode);
      });
    });
};

process.on("SIGINT", () => {
  cleanup(0);
});

process.on("SIGTERM", () => {
  cleanup(0);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  cleanup(1);
});
