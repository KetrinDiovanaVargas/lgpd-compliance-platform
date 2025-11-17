// server/geminiServer.mjs
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRouter from "./routes/analyze.mjs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// Rota de análise (Gemini)
app.use("/api/analyze", analyzeRouter);

// ✅ ⚙️ Ajuste para Express v5 – usar regex em vez de "*"
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// Em Express 5, o wildcard precisa ser definido com expressão regular:
app.get(/.*/, (_, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`🚀 Servidor full-stack rodando em http://localhost:${PORT}`);
});
