import { envVars } from "./config/env";
import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
let server: Server;
const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to DB!!");
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
(async () => {
  await startServer();
  //await seedSuperAdmin();
})();
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
});
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
});
process.on("SIGTERM", (err) => {
  console.log("SIGTERM signal received ... Server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
});
process.on("SIGINT", (err) => {
  console.log("SIGINT signal received ... Server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
});
