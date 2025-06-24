"use strict";

require("dotenv").config({ path: [".env.local", ".env"] });

const path = require("path");
const fs = require("fs");
const express = require("express");
const sequelize = require("./server/models/database.js");
const apiRoutes = require("./server/routes/api.js");

async function createServer() {
  const PORT = process.env.VITE_SERVER_PORT;
  const isProd = process.env.NODE_ENV === "production";
  const root = process.cwd();

  const app = express();

  app.use(express.json());

  sequelize
    .authenticate()
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Unable to connect to the database:", err));

  sequelize
    .sync()
    .then(() => console.log("Database synced"))
    .catch((err) => console.error("Error syncing database:", err));

  app.use(process.env.VITE_API_BASE_URL, apiRoutes);

  if (!isProd) {
    const { createServer: createViteServer } = require("vite");

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);

    app.use(async (req, res, next) => {
      const url = req.originalUrl;

      if (req.method !== "GET" || url.includes(".")) {
        return next();
      }

      try {
        const indexPath = path.resolve(root, "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");

        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (error) {
        console.error(error);
        res.status(500).end(error.message);
      }
    });
  } else {
    const distPath = path.resolve(root, "dist");

    app.use(express.static(distPath));

    app.use((req, res, next) => {
      if (req.method === "GET" && !req.path.includes(".")) {
        res.sendFile(path.resolve(distPath, "index.html"));
      } else {
        next();
      }
    });
  }

  const server = app.listen(PORT, () => {
    console.log(
      `> ${isProd ? "Prod" : "Dev"} mode`,
      `\n> ${process.env.VITE_SERVER_ORIGIN}`
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
}

createServer();
