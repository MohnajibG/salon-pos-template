import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 3000,

  MONGO_URI: process.env.MONGO_URI || "",

  JWT_SECRET: process.env.JWT_SECRET || "",
};

// Debug uniquement au démarrage
console.log(`
====================================
⚙️ ENVIRONMENT CHECK
====================================
PORT        : ${env.PORT}
MONGO_URI   : ${env.MONGO_URI ? "✅ Loaded" : "❌ Missing"}
JWT_SECRET  : ${env.JWT_SECRET ? "✅ Loaded" : "❌ Missing"}
====================================
`);
