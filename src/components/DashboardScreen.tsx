import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, CheckCircle, AlertTriangle, XCircle, Shield, FileText, Lock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface DashboardScreenProps {
  score: number;
  responses: Record<string, any>;
  onNewAssessment: () => void;
}

export const DashboardScreen = ({ score, responses, onNewAssessment }: DashboardScreenProps) => {
  const complianceScore = score || 0;

  const riskLevel = complianceScore >= 80 ? "low" : complianceScore >= 50 ? "medium" : "high";

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-400 bg-green-950/50 border-green-800";
      case "medium": return "text-yellow-400 bg-yellow-950/50 border-yellow-800";
      case "high": return "text-red-400 bg-red-950/50 border-red-800";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low": return <CheckCircle className="w-5 h-5" />;
      case "medium": return <AlertTriangle className="w-5 h-5" />;
      case "high": return <XCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  // Data for charts
  const scoreData = [
    { name: 'Score', value: complianceScore, fill: 'hsl(var(--primary))' },
    { name: 'Remaining', value: 100 - complianceScore, fill: 'hsl(var(--muted))' }
  ];

  const riskDistribution = [
    { name: 'Baixo Risco', value: 35, fill: 'hsl(142 76% 36%)' },
    { name: 'Médio Risco', value: 45, fill: 'hsl(48 96% 53%)' },
    { name: 'Alto Risco', value: 20, fill: 'hsl(0 84% 60%)' }
  ];

  const controlsData = [
    { category: 'Criptografia', implemented: 7, total: 10 },
    { category: 'Acesso', implemented: 8, total: 10 },
    { category: 'Backup', implemented: 6, total: 10 },
    { category: 'Monitoramento', implemented: 5, total: 10 },
    { category: 'Documentação', implemented: 9, total: 10 }
  ];

  const radialData = [
    { name: 'Compliance', value: complianceScore, fill: 'hsl(var(--primary))' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1526] to-[#000000] relative overflow-hidden py-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-40 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-40 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-4xl font-bold mb-2 text-white">
            Resultado da Análise
          </h1>
          <p className="text-white/80">
            Análise completa de conformidade LGPD e riscos ISO/IEC 27001
          </p>
        </div>

        {/* Score Overview with Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Score Card */}
          <Card className="p-6 shadow-elegant animate-fade-up bg-card/10 backdrop-blur-sm border-border/20" style={{ animationDelay: "0.1s" }}>
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2 text-white">
                <Shield className="w-5 h-5 text-primary" />
                Score de Conformidade
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="60%" 
                  outerRadius="90%" 
                  barSize={15} 
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                  />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground">
                    <tspan fontSize="42" fontWeight="bold">{complianceScore}</tspan>
                    <tspan fontSize="16" x="50%" dy="1.5em" className="fill-muted-foreground">de 100</tspan>
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
              <Badge className={`${getRiskColor(riskLevel)} px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 mt-4`}>
                {getRiskIcon(riskLevel)}
                Risco: {riskLevel === "low" ? "Baixo" : riskLevel === "medium" ? "Médio" : "Alto"}
              </Badge>
            </div>
          </Card>

          {/* Risk Distribution */}
          <Card className="p-6 shadow-elegant animate-fade-up bg-card/10 backdrop-blur-sm border-border/20" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Distribuição de Riscos
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
              {riskDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.fill }} />
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6 shadow-elegant animate-fade-up bg-card/10 backdrop-blur-sm border-border/20" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <FileText className="w-5 h-5 text-primary" />
              Estatísticas
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">Pontos Fortes</span>
                </div>
                <span className="text-lg font-bold text-green-400">12</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white">Atenção Necessária</span>
                </div>
                <span className="text-lg font-bold text-yellow-400">8</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-white">Crítico</span>
                </div>
                <span className="text-lg font-bold text-red-400">3</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls Implementation Chart */}
        <Card className="p-6 shadow-elegant mb-8 animate-fade-up bg-card/10 backdrop-blur-sm border-border/20" style={{ animationDelay: "0.4s" }}>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
            <Lock className="w-5 h-5 text-primary" />
            Status de Controles ISO/IEC 27001
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={controlsData} layout="vertical">
              <XAxis type="number" domain={[0, 10]} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="category" type="category" width={120} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar dataKey="implemented" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
              <Bar dataKey="total" fill="hsl(var(--muted))" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Key Findings */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 shadow-card animate-fade-up bg-card/10 backdrop-blur-sm border-border/20" style={{ animationDelay: "0.5s" }}>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Pontos Fortes
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 p-3 bg-green-950/20 rounded-lg border border-green-800/30">
                <span className="text-green-400 mt-0.5">✓</span>
                <span className="text-sm text-white">Política de privacidade adequada e atualizada</span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-green-950/20 rounded-lg border border-green-800/30">
                <span className="text-green-400 mt-0.5">✓</span>
                <span className="text-sm text-white">Processo de consentimento documentado</span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-green-950/20 rounded-lg border border-green-800/30">
                <span className="text-green-400 mt-0.5">✓</span>
                <span className="text-sm text-white">Treinamento regular da equipe</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 shadow-card animate-fade-up bg-card/10 backdrop-blur-sm border-border/20" style={{ animationDelay: "0.6s" }}>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Áreas de Atenção
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 p-3 bg-yellow-950/20 rounded-lg border border-yellow-800/30">
                <span className="text-yellow-400 mt-0.5">!</span>
                <span className="text-sm text-white">Melhorar medidas de segurança técnica</span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-yellow-950/20 rounded-lg border border-yellow-800/30">
                <span className="text-yellow-400 mt-0.5">!</span>
                <span className="text-sm text-white">Documentar processos de resposta a incidentes</span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-yellow-950/20 rounded-lg border border-yellow-800/30">
                <span className="text-yellow-400 mt-0.5">!</span>
                <span className="text-sm text-white">Revisar e atualizar controles de acesso</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="p-6 shadow-elegant mb-8 animate-fade-up bg-card/10 backdrop-blur-sm border-border/20" style={{ animationDelay: "0.7s" }}>
          <h3 className="text-xl font-semibold mb-4 text-white">Recomendações Prioritárias</h3>
          <div className="space-y-3">
            {[
              {
                title: "Implementar criptografia end-to-end",
                priority: "Alta",
                iso: "A.10.1.1",
              },
              {
                title: "Estabelecer política de backup automatizado",
                priority: "Alta",
                iso: "A.12.3.1",
              },
              {
                title: "Documentar processos de tratamento de dados",
                priority: "Média",
                iso: "A.18.1.1",
              },
            ].map((rec, index) => (
              <div key={index} className="flex items-start justify-between p-4 bg-muted/30 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium mb-1 text-white">{rec.title}</h4>
                  <p className="text-sm text-white/70">
                    Controle ISO/IEC 27001: {rec.iso}
                  </p>
                </div>
                <Badge variant={rec.priority === "Alta" ? "destructive" : "secondary"}>
                  {rec.priority}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.8s" }}>
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-1"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button 
            size="lg" 
            className="flex-1 shadow-elegant hover:shadow-glow transition-all"
            onClick={onNewAssessment}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Nova Avaliação
          </Button>
        </div>
      </div>
    </div>
  );

};

  export default DashboardScreen;