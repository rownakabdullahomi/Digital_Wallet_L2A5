/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import envVars from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    const conn = await mongoose.connect(envVars.DATABASE_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    server = app.listen(envVars.PORT, () => {
      console.log(`⚡ Server is running on port: ${envVars.PORT}.`);
    });
  } catch (error) {
    console.log(`❌ Error: ${error}`);
    process.exit(1);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

/// Unhandled Rejection Error
process.on("unhandledRejection", (error) => {
  console.log(
    "❌ Unhandled Rejection detected... Server is shutting down...",
    error
  );
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

/// Uncaught Exception Error
process.on("uncaughtException", (error) => {
  console.log(
    "❌ Uncaught Exception detected... Server is shutting down...",
    error
  );
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

/// Signal Termination
process.on("SIGTERM", () => {
  console.log("❌ SIGTERM signal received... Server is shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

/// Signal Initialization
process.on("SIGINT", () => {
  console.log("📶 SIGINT signal received... Server is shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
