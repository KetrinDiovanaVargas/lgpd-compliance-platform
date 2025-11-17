import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoute from "./routes/analyze.mjs";   // ROTA DO GROQ

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;

// Middlewares obrigatórios
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Rotas
app.use("/api/analyze", analyzeRoute);

// Test route
app.get("/", (req, res) => {
  res.send("🔥 Servidor GROQ rodando!");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
