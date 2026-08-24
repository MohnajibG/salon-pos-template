import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { autoCloseStaleRegisters } from "./services/cashRegister.service";

const AUTO_CLOSE_INTERVAL_MS = 60 * 60 * 1000; // 1h

const runAutoClose = async () => {
  try {
    const count = await autoCloseStaleRegisters();

    if (count > 0) {
      console.log(`🔒 ${count} caisse(s) fermée(s) automatiquement`);
    }
  } catch (error) {
    console.error("❌ Auto-fermeture des caisses échouée", error);
  }
};

const startServer = async () => {
  try {
    /*
      IMPORTANT:
      On démarre Express avant MongoDB.
      Northflank doit voir le port ouvert.
    */

    app.listen(env.PORT, "0.0.0.0", async () => {
      console.log(`
====================================
🚀 Flowdesk API
====================================
Server : http://0.0.0.0:${env.PORT}
Status : Running
====================================
`);

      try {
        await connectDB();

        await runAutoClose();
        setInterval(runAutoClose, AUTO_CLOSE_INTERVAL_MS);
      } catch (error) {
        console.error("❌ Database initialization failed");

        console.error(error);

        process.exit(1);
      }
    });
  } catch (error) {
    console.error("❌ Server startup failed");

    console.error(error);

    process.exit(1);
  }
};

startServer();
