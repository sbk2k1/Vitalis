const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const cluster = require("cluster");
require("dotenv/config");

// Compression
app.use(
  compression({
    level: 6,
    threshold: 10 * 1000,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

// CORS
app.use(cors());

// Database
require("./services/db");

// redis
require("./services/redis");

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Run schedule
require("./services/scheduleapi");

// ------------------ Documentation  ------------------

// API documentation

// api routes
// /api/workspace - get - get all workspaces
// /api/workspace - post - create a workspace
// /api/workspace/:id - get - get a workspace by id

// /api/connection - get - get all connections
// /api/connection - post - create a connection

// ------------------ API ------------------

// Routes
const apiRoutes = require("./routes/apiRoutes");
const userRoutes = require("./routes/userRoutes");

app.get("/", (req, res) => {
  res.json({
    error: false,
    message: "Welcome to the official Vitalis API",
  });
});
app.use("/api", apiRoutes);
app.use("/user", userRoutes);

// ------------------ 404 ------------------

// 404 Error
app.use((req, res) => {
  res.status(404).send("404 Error: Page not found");
});
// ------------------ Cluster ------------------

// const numCPUs = require("os").cpus().length;

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
// } else {
//   app.listen(process.env.PORT, () => {
//     console.log(`Server ${process.pid} is running on port ${process.env.PORT}`);
//   });
// }

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});