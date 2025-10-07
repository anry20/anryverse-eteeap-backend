import express from "express";
import cors from "cors";
import { errorHandler } from "./src/middlewares/errorHandler";
import { unknownRouteHandler } from "./src/middlewares/unknownRouteHandler";
import authenticationRoutes from "./src/routes/authenticationRoutes";
import cookiesParser from "cookie-parser";
import "./src/types/session";
import adminApiRoutes from "./src/routes/adminApiRoutes";
import facultyApiRoutes from "./src/routes/facultyApiRoutes";
import studentApiRoutes from "./src/routes/studentApiRoutes";
import {
  checkAuthAndRole,
  checkRoleAdmin,
  checkRoleFaculty,
  checkRoleStudent,
} from "./src/middlewares/auth";

const app = express();

app.use(express.json());
app.use(cookiesParser());

const allowedOrigins = ["http://localhost:3000", "https://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
    credentials: true,
  })
);

// Routes
app.use("/auth", authenticationRoutes);
app.use("/admin", checkAuthAndRole, checkRoleAdmin, adminApiRoutes);
app.use("/faculty", checkAuthAndRole, checkRoleFaculty, facultyApiRoutes);
app.use("/student", checkAuthAndRole, checkRoleStudent, studentApiRoutes);

// Handle unknown routes
app.use(unknownRouteHandler);

// Global error handler
app.use(errorHandler);

export default app;
