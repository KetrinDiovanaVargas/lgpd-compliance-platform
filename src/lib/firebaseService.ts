import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const saveResponses = async (userId: string, responses: Record<string, any>) => {
  try {
    const docRef = await addDoc(collection(db, "responses"), {
      user_id: userId,
      responses,
      created_at: serverTimestamp(),
    });
    return { id: docRef.id, ...responses };
  } catch (error) {
    console.error("Erro ao salvar respostas:", error);
    throw error;
  }
};
