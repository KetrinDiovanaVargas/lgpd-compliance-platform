import { db } from "@/integrations/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

// Salva uma resposta específica de um estágio
export const saveResponsesStage = async (
  userId: string,
  responses: any,
  stage: number
) => {
  try {
    // Remove valores undefined
    const safeResponses = JSON.parse(JSON.stringify(responses));

    // 🔥 Caminho válido no Firestore:
    // responses → userId(doc) → stages(col) → stage(doc) → questions(col)
    const questionsRef = collection(
      db,
      "responses",
      userId,
      "stages",
      stage.toString(),
      "questions"
    );

    const docRef = await addDoc(questionsRef, {
      stage,
      responses: safeResponses,
      createdAt: serverTimestamp(),
    });

    console.log(`✅ Resposta do estágio ${stage} salva no Firestore:`, docRef.id);
    toast.success(`✅ Resposta do estágio ${stage} salva com sucesso!`);

    return docRef.id;

  } catch (error) {
    console.error("❌ Erro ao salvar resposta do estágio:", error);
    toast.error("❌ Erro ao salvar resposta.");
    throw error;
  }
};
