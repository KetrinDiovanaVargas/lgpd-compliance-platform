import { db } from "@/integrations/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

// Salva respostas no Firestore
export const saveResponses = async (userId: string, responses: any, stage: number) => {
  try {
    // Remove valores undefined
    const safeResponses = JSON.parse(JSON.stringify(responses));

    const docRef = await addDoc(collection(db, "responses"), {
      userId,
      stage,
      responses: safeResponses,
      createdAt: serverTimestamp(),
    });

    console.log("✅ Resposta salva no Firestore:", docRef.id);
    toast.success("✅ Resposta salva com sucesso no servidor!");

    return docRef.id;

  } catch (error) {
    console.error("❌ Erro ao salvar no Firestore:", error);
    toast.error("❌ Erro ao salvar respostas.");
    throw error;
  }
};
