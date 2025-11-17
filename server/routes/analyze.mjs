// server/routes/analyze.mjs
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const router = express.Router();

/* ------------------------------------------------------------------
   1) GERA O PROMPT COMPLETO PARA O GROQ
-------------------------------------------------------------------*/
function buildPrompt({ userId, responses }) {
  const formatted = responses
    .map((r, i) => `Pergunta ${i + 1} (${r.questionId}): ${r.answer}`)
    .join("\n");

  return `
Você é um consultor especialista em LGPD e ISO/IEC 27001.

Analise profundamente as respostas abaixo e gere um relatório técnico altamente profissional.
Sempre utilize o termo “participante da avaliação”.  
Nunca gere textos repetitivos.  
NUNCA gere recomendações genéricas para todas as categorias.

ID do participante: ${userId}

RESPOSTAS COLETADAS:
${formatted}

GERE UM RELATÓRIO COMPLETO COM AS SEÇÕES:

1. Score de Conformidade  
2. Percentuais de Risco (Conforme / Parcial / Não Conforme)  
3. Pontos Fortes (lista objetiva)  
4. Pontos de Atenção (lista objetiva)  
5. Riscos Críticos (lista objetiva)  
6. Conclusão Técnica e Recomendações Gerais  

⚠️ AGORA O MAIS IMPORTANTE:
Gere RECOMENDAÇÕES DE FORMA PERSONALIZADA por categoria.

Cada recomendação deve ser EXCLUSIVA e baseada em:
- categoria associada ao risco detectado  
- problemas reais encontrados  
- pontos críticos levantados  
- boas práticas LGPD  
- controles ISO/IEC 27001  

NUNCA repita uma recomendação entre categorias.

Cada recomendação deve conter:
- title: nome da recomendação (EX: “Implementar Controle de Acesso”)  
- description: explicação técnica  
- priority: Alta | Média | Baixa  
- category: categoria LGPD/ISO associada  
- actions: lista de ações práticas específicas  
- learning:  
   • book: livro recomendado  
   • video: vídeo recomendado  
   • references: referências ISO e LGPD específicas da categoria

⚠️ FORMATO FINAL OBRIGATÓRIO:

Primeiro escreva o RELATÓRIO TÉCNICO em texto corrido, com as seções acima.

EM SEGUIDA, NA ÚLTIMA LINHA DA RESPOSTA, retorne SOMENTE o JSON abaixo (sem markdown, sem comentários, sem texto extra):

{
 "score": <num>,
 "risks": {
    "conforme": <num>,
    "parcial": <num>,
    "naoConforme": <num>
 },
 "strengths": [...],
 "attentionPoints": [...],
 "criticalIssues": [...],
 "recommendations": [
     {
       "title": "",
       "description": "",
       "priority": "",
       "category": "",
       "actions": [""],
       "learning": {
         "book": "",
         "video": "",
         "references": ""
       }
     }
 ],
 "controlsStatus": [
     { "name": "Criptografia", "value": <0-5> },
     { "name": "Acesso", "value": <0-5> },
     { "name": "Backup", "value": <0-5> },
     { "name": "Monitoramento", "value": <0-5> },
     { "name": "Documentação", "value": <0-5> }
 ]
}

A ÚLTIMA LINHA da resposta deve ser APENAS o JSON PURO.
Nenhuma explicação depois do JSON.
`;
}

/* ------------------------------------------------------------------
   2) EXTRAI O JSON DO TEXTO DO GROQ (MODO ROBUSTO)
-------------------------------------------------------------------*/
function extractMetrics(text) {
  if (!text) {
    console.error("❌ Texto vazio recebido do GROQ.");
    return null;
  }

  console.log("📨 Texto bruto recebido do GROQ >>>", text);

  // 1. Localiza o primeiro { e o último }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    console.error("❌ Nenhum bloco JSON válido encontrado no texto.");
    return null;
  }

  // 2. Extrai apenas o trecho que parece ser JSON
  let jsonStr = text.substring(start, end + 1);

  // 3. Corrige vírgulas inválidas antes de } e ]
  jsonStr = jsonStr.replace(/,\s*}/g, "}");
  jsonStr = jsonStr.replace(/,\s*]/g, "]");

  // 4. Remove quebras de linha e tabs
  jsonStr = jsonStr
    .replace(/\r/g, "")
    .replace(/\n/g, "")
    .replace(/\t/g, "")
    .trim();

  console.log("🧹 JSON Extraído e Limpo >>>", jsonStr);

  // 5. Tenta fazer o parse
  try {
    const parsed = JSON.parse(jsonStr);
    console.log("✅ JSON parseado com sucesso!");
    return parsed;
  } catch (err) {
    console.error("❌ ERRO AO FAZER PARSE DO JSON:", err);
    console.error("🔍 JSON com erro >>>", jsonStr);
    return null;
  }
}

/* ------------------------------------------------------------------
   3) ROTA PRINCIPAL
-------------------------------------------------------------------*/
router.post("/", async (req, res) => {
  try {
    const { userId, responses } = req.body;

    const prompt = buildPrompt({ userId, responses });

    console.log("🔵 Enviando requisição ao GROQ...");

    const apiResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
        }),
      }
    );

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error("❌ Erro do GROQ:", data);
      return res.status(500).json({
        error: "Erro ao consultar GROQ",
        details: data,
      });
    }

    const fullText = data?.choices?.[0]?.message?.content || "";

    console.log("📄 Relatório Gemini/GROQ (texto completo) >>>", fullText);

    const jsonData = extractMetrics(fullText);

    console.log("📊 Métricas estruturadas:", jsonData);

    const safeMetrics = jsonData || {
      score: 0,
      risks: { conforme: 0, parcial: 0, naoConforme: 0 },
      strengths: [],
      attentionPoints: [],
      criticalIssues: [],
      recommendations: [],
      controlsStatus: [],
    };

    return res.json({
      success: true,
      report: fullText,
      metrics: safeMetrics,
    });
  } catch (err) {
    console.error("❌ Erro interno:", err);
    return res.status(500).json({
      error: "Erro interno no servidor",
      details: err.message,
    });
  }
});

export default router;
