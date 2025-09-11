import express from "express";
import cors from "cors";
import studentRoutes from "./src/routes/studentRoutes";
import courseRoutes from "./src/routes/courseRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
import { unknownRouteHandler } from "./src/middlewares/unknownRouteHandler";
import facultyRoutes from "./src/routes/facultyRoutes";
import subjectRoutes from "./src/routes/subjectRoutes";
import loginRoutes from "./src/routes/authenticationRoutes";
import cookiesParser from "cookie-parser";
import {
  authMiddleware,
  preventLoginForAuthenticated,
} from "./src/middlewares/auth";

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
app.use("/", preventLoginForAuthenticated, loginRoutes);
app.use("/", authMiddleware, courseRoutes);
app.use("/", authMiddleware, studentRoutes);
app.use("/", authMiddleware, facultyRoutes);
app.use("/", authMiddleware, subjectRoutes);

// Handle unknown routes
app.use(unknownRouteHandler);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
