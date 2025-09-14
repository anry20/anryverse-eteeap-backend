import express from "express";
import cors from "cors";
import { errorHandler } from "./src/middlewares/errorHandler";
import { unknownRouteHandler } from "./src/middlewares/unknownRouteHandler";
import authenticationRoutes from "./src/routes/authenticationRoutes";
import cookiesParser from "cookie-parser";
import "./src/types/session";

const app = express();

app.use(express.json());
app.use(cookiesParser());

const allowedOrigins = ["http://localhost:3000", "https://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        // allow requests with no origin (like mobile apps or curl)
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

// Handle unknown routes
app.use(unknownRouteHandler);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
