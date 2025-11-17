import { db } from "@/integrations/firebase/client";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

// Salva todas as perguntas de um stage
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
            // Em vez de ...data, salvamos tudo dentro de "responses"
            responses: data,

            // Guarda index da pergunta
            question: Number(questionIndex),

            // Guarda número do stage
            stage: stage,

            // Timestamp do Firestore
            createdAt: serverTimestamp(),
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
