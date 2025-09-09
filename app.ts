import express from "express";
import templateRoutes from "./src/routes/templateRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
import { unknownRouteHandler } from "./src/middlewares/unknownRouteHandler";

const app = express();

app.use(express.json());

// Routes
app.use("/", templateRoutes);

// Handle unknown routes
app.use(unknownRouteHandler);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
