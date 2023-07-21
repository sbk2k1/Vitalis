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

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Run schedule
require("./services/scheduleapi");
require("./services/schedulesql");

// ------------------ Documentation  ------------------

// API documentation

// api routes
// /api/workspace - get - get all workspaces
// /api/workspace - post - create a workspace
// /api/workspace/:id - get - get a workspace by id

// /api/connection - get - get all connections
// /api/connection - post - create a connection

// sql routes
// /sql/workspace - get - get all workspaces
// /sql/workspace - post - create a workspace
// /sql/workspace/:id - get - get a workspace by id

// /sql/connection - get - get all connections
// /sql/connection - post - create a connection

// ------------------ API & SQL------------------

// Routes
const apiRoutes = require("./routes/apiRoutes");
const sqlRoutes = require("./routes/sqlRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api", apiRoutes);
app.use("/sql", sqlRoutes);
app.use("/user", userRoutes);

// ------------------ 404 ------------------

// 404 Error
app.use((req, res) => {
  res.status(404).send("404 Error: Page not found");
});
// ------------------ Cluster ------------------

const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  app.listen(process.env.PORT, () => {
    console.log(`Server ${process.pid} is running on port ${process.env.PORT}`);
  });
}
