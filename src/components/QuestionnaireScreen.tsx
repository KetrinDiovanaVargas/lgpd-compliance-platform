import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { saveResponsesStage } from "@/services/saveResponsesStage";

interface Question {
  id: string;
  type: "select" | "checkbox" | "textarea";
  question: string;
  description?: string;
  options?: string[];
  required?: boolean;
}

interface Stage {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

interface QuestionnaireScreenProps {
  stages: Stage[];
  onComplete: (data: any) => void;
  onBack: () => void;
}

export const QuestionnaireScreen = ({
  stages,
  onComplete,
  onBack,
}: QuestionnaireScreenProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [responses, setResponses] = useState<Record<number, any>>({});
  const [stageResponses, setStageResponses] = useState<Record<number, any>>({});

  const [showOtherInput, setShowOtherInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingNext, setIsProcessingNext] = useState(false);

  const stage = stages[currentStage];
  const question = stage.questions[currentQuestion];

  // índice global da pergunta
  const globalQuestionIndex =
    stages
      .slice(0, currentStage)
      .reduce((sum, s) => sum + s.questions.length, 0) + currentQuestion;

  // progresso geral
  const totalQuestions = stages.reduce((sum, s) => sum + s.questions.length, 0);
  const completedQuestions =
    stages.slice(0, currentStage).reduce((sum, s) => sum + s.questions.length, 0) +
    currentQuestion;

  const progress = ((completedQuestions + 1) / totalQuestions) * 100;

  // 🔥 salvar pergunta + resposta
  const handleResponse = (value: any) => {
    const data = {
      question: question.question,
      answer: value,
    };

    setResponses((prev) => ({
      ...prev,
      [globalQuestionIndex]: data,
    }));

    setStageResponses((prev) => ({
      ...prev,
      [currentQuestion]: data, // <= agora salva com ID 0..4 dentro da etapa
    }));
  };

  // 🔥 salva bloco de 5 questões
  const saveCurrentStageBlock = async () => {
    try {
      await saveResponsesStage("usuario_demo", stageResponses, currentStage);

      toast.success(`Etapa ${currentStage + 1} salva!`);

      setStageResponses({});
    } catch (error) {
      console.error("Erro ao salvar etapa:", error);
      toast.error("Erro ao salvar etapa.");
    }
  };

  const handleNext = async () => {
    if (isProcessingNext) return;
    setIsProcessingNext(true);

    if (question.required && !responses[globalQuestionIndex]) {
      toast.error("Responda antes de continuar.");
      setIsProcessingNext(false);
      return;
    }

    // 5ª pergunta → salva bloco
    const isLastQuestionOfBlock = (currentQuestion + 1) % 5 === 0;
    if (isLastQuestionOfBlock) {
      await saveCurrentStageBlock();
    }

    if (currentQuestion < stage.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setShowOtherInput(false);
    } else if (currentStage < stages.length - 1) {
      setCurrentStage((prev) => prev + 1);
      setCurrentQuestion(0);
      setShowOtherInput(false);
    } else {
      await handleSubmitStage();
    }

    setIsProcessingNext(false);
  };

  const handlePrevious = () => {
    setShowOtherInput(false);

    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    } else if (currentStage > 0) {
      setCurrentStage((prev) => prev - 1);
      setCurrentQuestion(stages[currentStage - 1].questions.length - 1);
    }
  };

  // envio final
  const handleSubmitStage = async () => {
    setIsSubmitting(true);

    try {
      await saveResponsesStage("usuario_demo", stageResponses, currentStage);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "usuario_demo",
          responses: Object.entries(responses).map(([idx, data]) => ({
            questionId: Number(idx),
            question: data.question,
            answer: data.answer,
          })),
        }),
      });

      const result = await response.json();

      onComplete({
        responses,
        report: result.report,
        metrics: result.metrics,
      });

      toast.success("Análise gerada com sucesso!");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao enviar análise.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestionInput = () => {
    const currentValue = responses[globalQuestionIndex]?.answer;

    switch (question.type) {
      case "select":
        return (
          <div className="space-y-4">
            <Select
              value={currentValue}
              onValueChange={(value) => {
                handleResponse(value);
                setShowOtherInput(value === "Outro");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma opção..." />
              </SelectTrigger>

              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showOtherInput && (
              <input
                className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/20 text-white"
                placeholder="Digite aqui..."
                onChange={(e) =>
                  handleResponse(e.target.value)
                }
              />
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const currentArr = currentValue || [];
              return (
                <div key={option} className="flex items-center gap-2">
                  <Checkbox
                    id={option}
                    checked={currentArr.includes(option)}
                    onCheckedChange={(checked) => {
                      let arr = [...currentArr];
                      if (checked) arr.push(option);
                      else arr = arr.filter((v) => v !== option);

                      handleResponse(arr);
                    }}
                  />
                  <Label htmlFor={option} className="text-white">
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        );

      case "textarea":
        return (
          <Textarea
            className="min-h-[120px]"
            value={currentValue || ""}
            onChange={(e) => handleResponse(e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1526] to-black py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Cabeçalho */}
        <div className="mb-8 text-center">
          <p className="text-primary text-sm">{stage.title}</p>
          <p className="text-white/70 text-xs">{stage.description}</p>
        </div>

        {/* Progresso */}
        <div className="mb-8">
          <div className="flex justify-between mb-1 text-white/80 text-sm">
            <span>
              Questão {currentQuestion + 1} de {stage.questions.length} (Etapa{" "}
              {currentStage + 1})
            </span>
            <span className="text-primary font-medium">
              {Math.round(progress)}% completo
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Card principal */}
        <Card className="p-8 bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">{question.question}</h2>

          {question.description && (
            <p className="text-white/70 mb-2">{question.description}</p>
          )}

          {question.required && (
            <p className="text-red-400 text-xs mb-4">* Campo obrigatório</p>
          )}

          {renderQuestionInput()}

          {/* Botões */}
          <div className="flex gap-4 mt-8">
            <Button
              variant="outline"
              onClick={currentStage === 0 && currentQuestion === 0 ? onBack : handlePrevious}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {currentStage === 0 && currentQuestion === 0 ? "Voltar ao Início" : "Anterior"}
            </Button>

            <Button
              onClick={handleNext}
              disabled={isSubmitting || isProcessingNext}
              className="flex-1"
            >
              {isSubmitting || isProcessingNext ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Próxima
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuestionnaireScreen;
