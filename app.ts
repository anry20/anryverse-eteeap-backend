import express from "express";
import cors from "cors";
import studentRoutes from "./src/routes/studentRoutes";
import courseRoutes from "./src/routes/courseRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
import { unknownRouteHandler } from "./src/middlewares/unknownRouteHandler";
import facultyRoutes from "./src/routes/facultyRoutes";
import subjectRoutes from "./src/routes/subjectRoutes";
import authenticationRoutes from "./src/routes/authenticationRoutes";
import cookiesParser from "cookie-parser";
import adminRoutes from "./src/routes/adminRoutes";
import subjectFacultyRoutes from "./src/routes/subjectFacultyRoutes";
import termRoutes from "./src/routes/termRoutes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookiesParser());

// Routes
app.use("/", authenticationRoutes);
app.use("/", courseRoutes);
app.use("/", studentRoutes);
app.use("/", facultyRoutes);
app.use("/", subjectRoutes);
app.use("/", adminRoutes);
app.use("/", subjectFacultyRoutes);
app.use("/", termRoutes);

// Handle unknown routes
app.use(unknownRouteHandler);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
