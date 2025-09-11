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
  requireAuthentication,
  preventAuthenticatedAccess,
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
app.use("/", preventAuthenticatedAccess, loginRoutes);
app.use("/", requireAuthentication, courseRoutes);
app.use("/", requireAuthentication, studentRoutes);
app.use("/", requireAuthentication, facultyRoutes);
app.use("/", requireAuthentication, subjectRoutes);

// Handle unknown routes
app.use(unknownRouteHandler);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
