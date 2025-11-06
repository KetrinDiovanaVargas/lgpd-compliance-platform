import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  onComplete: (responses: Record<string, any>) => void;
  onBack: () => void;
}

export const QuestionnaireScreen = ({ stages, onComplete, onBack }: QuestionnaireScreenProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stage = stages[currentStage];
  const question = stage.questions[currentQuestion];
  
  // Calculate total progress across all stages
  const totalQuestions = stages.reduce((sum, s) => sum + s.questions.length, 0);
  const completedQuestions = stages.slice(0, currentStage).reduce((sum, s) => sum + s.questions.length, 0) + currentQuestion;
  const progress = ((completedQuestions + 1) / totalQuestions) * 100;

  const handleResponse = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [question.id]: value
    }));
  };

  const handleNext = () => {
    if (question.required && !responses[question.id]) {
      toast.error("Por favor, responda esta pergunta antes de continuar");
      return;
    }

    // Check if there are more questions in current stage
    if (currentQuestion < stage.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } 
    // Check if there are more stages
    else if (currentStage < stages.length - 1) {
      setCurrentStage(prev => prev + 1);
      setCurrentQuestion(0);
      toast.success(`Etapa ${currentStage + 1} concluída!`);
    } 
    // All done
    else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentStage > 0) {
      setCurrentStage(prev => prev - 1);
      setCurrentQuestion(stages[currentStage - 1].questions.length - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(responses);
    } catch (error) {
      toast.error("Erro ao processar respostas");
      setIsSubmitting(false);
    }
  };

  const renderQuestionInput = () => {
    const currentValue = responses[question.id];

    switch (question.type) {
      case "select":
        return (
          <Select value={currentValue} onValueChange={handleResponse}>
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
        );

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={currentValue?.includes(option)}
                  onCheckedChange={(checked) => {
                    const newValue = currentValue || [];
                    if (checked) {
                      handleResponse([...newValue, option]);
                    } else {
                      handleResponse(newValue.filter((v: string) => v !== option));
                    }
                  }}
                />
                <Label
                  htmlFor={option}
                  className="text-sm font-normal cursor-pointer text-white"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case "textarea":
        return (
          <Textarea
            value={currentValue || ""}
            onChange={(e) => handleResponse(e.target.value)}
            placeholder="Digite sua resposta..."
            className="min-h-[120px]"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1526] to-[#000000] relative overflow-hidden py-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>
      <div className="container relative z-10 mx-auto px-4 max-w-3xl">
        {/* Stage Indicator */}
        <div className="mb-6 animate-fade-in">
          <div className="flex justify-between items-center">
            {stages.map((s, index) => (
              <div
                key={s.id}
                className={`flex-1 h-2 ${
                  index < currentStage
                    ? "bg-primary"
                    : index === currentStage
                    ? "bg-primary/50"
                    : "bg-muted"
                } ${index === 0 ? "rounded-l-full" : ""} ${
                  index === stages.length - 1 ? "rounded-r-full" : ""
                }`}
              />
            ))}
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm font-medium text-primary">{stage.title}</p>
            <p className="text-xs text-white/70">{stage.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/80">
              Questão {currentQuestion + 1} de {stage.questions.length} (Etapa {currentStage + 1})
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}% completo
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 shadow-elegant animate-fade-up bg-card/10 backdrop-blur-sm border-border/50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 text-white">
              {question.question}
            </h2>
            {question.description && (
              <p className="text-white/80">
                {question.description}
              </p>
            )}
            {question.required && (
              <span className="text-xs text-destructive mt-1 inline-block">
                * Campo obrigatório
              </span>
            )}
          </div>

          <div className="mb-8">
            {renderQuestionInput()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4">
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
              disabled={isSubmitting}
              className="flex-1 shadow-card hover:shadow-elegant transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : currentStage === stages.length - 1 && currentQuestion === stage.questions.length - 1 ? (
                "Finalizar"
              ) : (
                <>
                  Próxima
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Help Text */}
        <p className="text-center text-sm text-white/70 mt-6">
          Suas respostas são salvas automaticamente e mantidas seguras
        </p>
      </div>
    </div>
  );
};

export default QuestionnaireScreen;
