import { db } from "@/integrations/firebase/client";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

// =====================================================
// 🔥 Salva todas as perguntas de um stage (0..5)
// =====================================================
export const saveResponsesStage = async (
  userId: string,
  responses: any,   // { 0: {…}, 1: {…}, 2: {…} ... }
  stage: number     // 0 a 5
) => {
  try {
    // Remove valores undefined
    const safeResponses = JSON.parse(JSON.stringify(responses));

    // Para cada pergunta (0..5)
    const writes = Object.entries(safeResponses).map(
      async ([questionIndex, data]) => {
        // 🔥 Caminho exato no Firestore
        const ref = doc(
          db,
          "responses",
          userId,
          "stages",
          String(stage),
          "questions",
          String(questionIndex) // ID fixo da pergunta 0..5
        );

        // 💾 Salva cada pergunta separadamente
        return setDoc(
          ref,
          {
            responses: data,

            question: Number(questionIndex), // índice da pergunta
            stage: stage,                    // número da etapa

            createdAt: serverTimestamp(),    // timestamp
          },
          { merge: true }
        );
      }
    );

    await Promise.all(writes);

    toast.success(`Stage ${stage} salvo com sucesso!`);
    console.log(`🔥 Stage ${stage} salvo com sucesso!`);

  } catch (error) {
    console.error("❌ Erro ao salvar respostas do stage:", error);
    toast.error("Erro ao salvar respostas.");
    throw error;
  }
};


// =====================================================
// 🔥 Salva RELATÓRIO FINAL DO GROQ
// =====================================================
export const saveFinalReport = async (
  userId: string,
  reportData: any
) => {
  try {
    // Caminho válido: collection/doc/collection/doc
    const ref = doc(
      db,
      "responses",
      userId,
      "report",              // COLLECTION
      "final"                // DOCUMENT
    );

    await setDoc(
      ref,
      {
        report: reportData.report ?? "",
        metrics: reportData.metrics ?? {},
        risks: reportData.risks ?? {},
        summary: reportData.summary ?? "",
        controls: reportData.controls ?? [],
        score: reportData.score ?? 0,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("✅ Relatório final salvo para:", userId);
    toast.success("Relatório final salvo com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao salvar relatório final:", error);
    toast.error("Erro ao salvar o relatório final.");
    throw error;
  }
};


