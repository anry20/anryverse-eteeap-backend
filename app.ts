import express from "express";
import studentRoutes from "./src/routes/studentRoutes";
import courseRoutes from "./src/routes/courseRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
import { unknownRouteHandler } from "./src/middlewares/unknownRouteHandler";

const app = express();

app.use(express.json());

// Routes
app.use("/", courseRoutes);
app.use("/", studentRoutes);

// Handle unknown routes
app.use(unknownRouteHandler);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
