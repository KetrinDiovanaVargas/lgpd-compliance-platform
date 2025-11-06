import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import QuestionnaireScreen from "@/components/QuestionnaireScreen";
import DashboardScreen from "@/components/DashboardScreen";
import { stages } from "../lib/questions";
import { saveResponses } from "../lib/firebaseService";
import { calculateComplianceScore } from "../lib/utils";
import { toast } from "sonner";


type Screen = "welcome" | "questionnaire" | "dashboard";

export const Index = () => {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [score, setScore] = useState<number>(0);

  const handleFinish = async (answers: Record<string, any>) => {
    setResponses(answers);
    const compliance = calculateComplianceScore(answers);
    setScore(compliance);

    try {
      await saveResponses("usuario_demo", answers);
      toast.success("Respostas salvas com sucesso!");
      setScreen("dashboard");
    } catch (error) {
      toast.error("Erro ao salvar respostas.");
      console.error(error);
    }
  };

  return (
    <>
      {screen === "welcome" && (
  <WelcomeScreen onStart={() => setScreen("questionnaire")} />
)}
      {screen === "questionnaire" && (
        <QuestionnaireScreen onComplete={handleFinish} stages={stages} onBack={() => setScreen("welcome")} />
      )}
      {screen === "dashboard" && (
        <DashboardScreen score={score} responses={responses} />
      )}
    </>
  );
};

export default Index;
