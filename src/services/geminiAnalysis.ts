import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Analisa os dados das respostas e retorna um relatório estruturado
 */
export async function analyzeWithGemini() {
  try {
    // 🔹 Busca todas as respostas do Firestore (que tenham respostas não vazias)
    const q = query(collection(db, "responses"), where("answers", "!=", []));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("📘 Dados do Firestore:", data);

    if (data.length === 0) {
      return { error: "Nenhum dado encontrado para análise." };
    }

    // 🔹 Monta o prompt com as respostas reais
    const prompt = `
      Você é um auditor especialista em LGPD e ISO/IEC 27001.

      Abaixo estão respostas coletadas em um questionário de diagnóstico organizacional:

      ${JSON.stringify(data, null, 2)}

      Analise tecnicamente e produza o seguinte resultado em JSON puro:
      {
        "score": número de 0 a 100 representando o nível de conformidade,
        "risks": {
          "conforme": percentual,
          "parcial": percentual,
          "naoConforme": percentual
        },
        "stats": {
          "pontosFortes": número,
          "atencaoNecessaria": número,
          "critico": número
        },
        "resumo": "parágrafo curto com a análise técnica e recomendações"
      }
    `;

    // 🔹 Gera a análise com Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("🧩 Retorno bruto do Gemini:", responseText);

    // 🔹 Extrai JSON da resposta do Gemini
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!jsonData) throw new Error("Resposta inválida do Gemini");

    return jsonData;
  } catch (error) {
    console.error("❌ Erro ao gerar análise com Gemini:", error);
    return { error: "Erro ao gerar análise automática." };
  }
}
