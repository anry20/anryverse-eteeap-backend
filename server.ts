import app from "./app";
import config from "./src/config/config";

const server = app.listen(config.port);

server.on("error", (err) => {
  if ((err as NodeJS.ErrnoException).code === "EADDRINUSE") {
    console.error(
      `Port ${config.port} is already in use. Please free it and try again.`
    );
    process.exit(1);
  } else {
    console.error("Server error:", err);
    process.exit(1);
  }
});
