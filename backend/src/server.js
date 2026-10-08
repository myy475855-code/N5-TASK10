require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const requestLogger = require("./middleware/requestLogger");
const internshipRoutes = require("./routes/internships");
const uploadRoutes = require("./routes/uploads");
const swagger = require("../docs/openapi.json");

const app = express();
const port = Number(process.env.PORT || 3000);
const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:8080";

app.use(helmet());
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(requestLogger);
app.use("/uploads", express.static("uploads"));
app.get("/health", (req, res) => res.status(200).json({ status: "ok", service: "internship-catalog-api" }));
app.use("/internships", internshipRoutes);
app.use("/uploads", uploadRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

app.use((err, req, res, next) => {
  console.error(JSON.stringify({ level: "error", message: err.message, stack: err.stack }));
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, "0.0.0.0", () => console.log(JSON.stringify({ level: "info", message: "API started", port })));