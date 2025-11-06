export interface Question {
  id: string;
  type: "select" | "checkbox" | "textarea";
  question: string;
  description?: string;
  options?: string[];
  required?: boolean;
}

export interface Stage {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export const stages: Stage[] = [
  {
    id: 1,
    title: "Etapa 1: Identificação de Perfil do Usuário",
    description: "Compreender seu perfil profissional e conhecimento sobre privacidade e proteção de dados",
    questions: [
      {
        id: "departamento",
        type: "select",
        question: "Em qual departamento você atua?",
        description: "Identifique a área principal da sua atuação",
        options: [
          "Recursos Humanos",
          "Tecnologia da Informação",
          "Jurídico/Compliance",
          "Financeiro",
          "Comercial/Vendas",
          "Marketing",
          "Operações",
          "Atendimento ao Cliente",
          "Outro"
        ],
        required: true
      },
      {
        id: "formacao",
        type: "select",
        question: "Qual sua formação acadêmica?",
        description: "Nível de escolaridade e área de formação",
        options: [
          "Ensino Médio",
          "Ensino Superior - Tecnologia",
          "Ensino Superior - Direito",
          "Ensino Superior - Administração",
          "Ensino Superior - Outras áreas",
          "Pós-graduação/MBA",
          "Mestrado/Doutorado"
        ],
        required: true
      },
      {
        id: "cargo",
        type: "select",
        question: "Qual seu cargo/função atual?",
        description: "Posição hierárquica na organização",
        options: [
          "Estagiário/Aprendiz",
          "Assistente/Auxiliar",
          "Analista",
          "Coordenador",
          "Gerente",
          "Diretor",
          "C-Level (CEO, CTO, etc.)",
          "DPO/Encarregado de Dados"
        ],
        required: true
      },
      {
        id: "experiencia",
        type: "select",
        question: "Há quanto tempo você atua na função atual?",
        description: "Experiência no cargo atual",
        options: [
          "Menos de 6 meses",
          "6 meses a 1 ano",
          "1 a 3 anos",
          "3 a 5 anos",
          "Mais de 5 anos"
        ],
        required: true
      },
      {
        id: "conhecimento_privacidade",
        type: "select",
        question: "Como você avalia seu conhecimento sobre privacidade e proteção de dados (LGPD)?",
        description: "Avalie seu nível de compreensão sobre o tema",
        options: [
          "Nenhum conhecimento",
          "Conhecimento básico - já ouvi falar",
          "Conhecimento intermediário - entendo os conceitos principais",
          "Conhecimento avançado - aplico no dia a dia",
          "Especialista - sou responsável pela área"
        ],
        required: true
      }
    ]
  },
  {
    id: 2,
    title: "Etapa 2: Competência e Interação com Dados",
    description: "Identificar suas competências e como você interage com dados no dia a dia",
    questions: [
      {
        id: "acesso_dados",
        type: "select",
        question: "Com que frequência você acessa ou manipula dados pessoais?",
        description: "Considere dados de clientes, colaboradores ou parceiros",
        options: [
          "Nunca ou raramente",
          "Ocasionalmente (algumas vezes por mês)",
          "Frequentemente (várias vezes por semana)",
          "Diariamente",
          "Constantemente (principal atividade)"
        ],
        required: true
      },
      {
        id: "tipos_dados_acesso",
        type: "checkbox",
        question: "Quais tipos de dados você acessa ou manipula?",
        description: "Selecione todas as opções que se aplicam",
        options: [
          "Dados de identificação (nome, CPF, RG)",
          "Dados de contato (e-mail, telefone, endereço)",
          "Dados financeiros (salários, contas bancárias)",
          "Dados de saúde",
          "Dados biométricos",
          "Dados sensíveis (raça, religião, orientação sexual)",
          "Dados de menores de idade",
          "Dados operacionais/técnicos",
          "Não acesso dados pessoais"
        ],
        required: true
      },
      {
        id: "sistemas_utilizados",
        type: "checkbox",
        question: "Quais sistemas ou ferramentas você utiliza para acessar dados?",
        description: "Identifique as plataformas que você usa",
        options: [
          "Sistema de CRM (gestão de clientes)",
          "Sistema de RH/folha de pagamento",
          "Sistema financeiro/ERP",
          "Planilhas Excel/Google Sheets",
          "Banco de dados direto",
          "Ferramentas de comunicação (email, chat)",
          "Sistemas em nuvem",
          "Sistemas próprios/internos",
          "Não utilizo sistemas com dados pessoais"
        ],
        required: true
      },
      {
        id: "compartilhamento_dados",
        type: "select",
        question: "Você compartilha dados pessoais com terceiros (fornecedores, parceiros)?",
        description: "Considere compartilhamentos internos e externos",
        options: [
          "Não compartilho dados",
          "Raramente compartilho",
          "Compartilho ocasionalmente com aprovação prévia",
          "Compartilho frequentemente seguindo procedimentos",
          "Compartilho regularmente sem procedimento formal"
        ],
        required: true
      },
      {
        id: "decisoes_dados",
        type: "select",
        question: "Você toma decisões que envolvem coleta, uso ou exclusão de dados pessoais?",
        description: "Nível de autonomia sobre o tratamento de dados",
        options: [
          "Não tomo decisões sobre dados",
          "Executo decisões definidas por outros",
          "Participo de decisões em equipe",
          "Tenho autonomia para decisões rotineiras",
          "Sou responsável por decisões estratégicas sobre dados"
        ],
        required: true
      }
    ]
  },
  {
    id: 3,
    title: "Etapa 3: Mapeamento de Processos",
    description: "Mapear processos organizacionais que envolvem tratamento de dados pessoais",
    questions: [
      {
        id: "processos_envolvidos",
        type: "checkbox",
        question: "Quais processos organizacionais você participa que envolvem dados pessoais?",
        description: "Identifique os processos do seu dia a dia",
        options: [
          "Recrutamento e seleção",
          "Onboarding de colaboradores",
          "Gestão de folha de pagamento",
          "Cadastro de clientes/prospects",
          "Processamento de vendas/pedidos",
          "Atendimento ao cliente/SAC",
          "Marketing e comunicação",
          "Gestão de fornecedores",
          "Auditoria interna",
          "Não participo de processos com dados pessoais"
        ],
        required: true
      },
      {
        id: "origem_dados",
        type: "checkbox",
        question: "De onde vêm os dados pessoais que você utiliza?",
        description: "Identifique as fontes de dados",
        options: [
          "Fornecidos diretamente pelos titulares",
          "Coletados em formulários web",
          "Importados de sistemas externos",
          "Recebidos de outras áreas da empresa",
          "Compartilhados por parceiros/fornecedores",
          "Coletados automaticamente (logs, cookies)",
          "Redes sociais",
          "Bancos de dados públicos",
          "Não sei a origem dos dados"
        ],
        required: true
      },
      {
        id: "finalidade_dados",
        type: "textarea",
        question: "Para qual finalidade principal os dados são utilizados nos processos que você participa?",
        description: "Descreva brevemente o propósito do uso dos dados (opcional)",
        required: false
      },
      {
        id: "documentacao_processos",
        type: "select",
        question: "Os processos que envolvem dados pessoais estão documentados?",
        description: "Existência de mapeamento formal dos processos",
        options: [
          "Não há documentação",
          "Documentação informal/parcial",
          "Documentação formal em desenvolvimento",
          "Documentação formal completa",
          "Documentação completa e atualizada regularmente",
          "Não sei informar"
        ],
        required: true
      },
      {
        id: "base_legal",
        type: "select",
        question: "Você tem conhecimento da base legal utilizada para o tratamento de dados nos seus processos?",
        description: "Ex: consentimento, cumprimento de obrigação legal, legítimo interesse",
        options: [
          "Não sei o que é base legal",
          "Sei o conceito mas não conheço a base dos meus processos",
          "Conheço parcialmente",
          "Conheço e está documentada",
          "Não aplicável - não trabalho com dados pessoais"
        ],
        required: true
      }
    ]
  },
  {
    id: 4,
    title: "Etapa 4: Avaliação de Controles",
    description: "Avaliar controles técnicos e administrativos de proteção de dados",
    questions: [
      {
        id: "controles_tecnicos",
        type: "checkbox",
        question: "Quais controles técnicos de segurança você conhece ou utiliza?",
        description: "Identifique as medidas de segurança implementadas",
        options: [
          "Criptografia de dados em trânsito",
          "Criptografia de dados em repouso",
          "Autenticação multifator (MFA)",
          "Controle de acesso baseado em perfis",
          "Logs e auditoria de acesso",
          "Backup regular de dados",
          "Firewall e antivírus",
          "Anonimização/pseudonimização",
          "VPN para acesso remoto",
          "Nenhum/Não sei"
        ],
        required: true
      },
      {
        id: "controles_administrativos",
        type: "checkbox",
        question: "Quais controles administrativos estão implementados?",
        description: "Políticas e procedimentos de gestão",
        options: [
          "Política de privacidade",
          "Política de segurança da informação",
          "Termos de uso e consentimento",
          "Procedimento de resposta a incidentes",
          "Treinamento periódico em proteção de dados",
          "Acordos de confidencialidade (NDA)",
          "Contratos com cláusulas de proteção de dados",
          "Processo de gestão de fornecedores",
          "Procedimento para direitos dos titulares (DSAR)",
          "Nenhum/Não sei"
        ],
        required: true
      },
      {
        id: "gestao_acesso",
        type: "select",
        question: "Como é gerenciado o acesso aos dados pessoais na organização?",
        description: "Processo de concessão e revogação de acessos",
        options: [
          "Não há controle formal de acesso",
          "Acesso liberado mediante solicitação informal",
          "Acesso controlado por gestores de área",
          "Processo formal com aprovação e registro",
          "Gestão automatizada com revisão periódica",
          "Não sei informar"
        ],
        required: true
      },
      {
        id: "incidentes_seguranca",
        type: "select",
        question: "Existe um processo para notificação e tratamento de incidentes de segurança?",
        description: "Como a organização responde a vazamentos ou acessos não autorizados",
        options: [
          "Não existe processo",
          "Processo informal não documentado",
          "Processo documentado mas não testado",
          "Processo completo e testado periodicamente",
          "Processo maduro com time dedicado",
          "Não sei informar"
        ],
        required: true
      },
      {
        id: "lacunas_controles",
        type: "textarea",
        question: "Você identifica alguma lacuna ou inconsistência nos controles de proteção de dados?",
        description: "Descreva pontos que você considera frágeis ou ausentes (opcional)",
        required: false
      }
    ]
  }
];
