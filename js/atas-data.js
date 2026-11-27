/**
 * =============================================================================
 * A.R.C.A. - Associação Recreativa e Cultural de Aguada de Baixo
 * Base de Dados Inicial e Gestão de Atas das Reuniões de Direção
 * =============================================================================
 */

(function() {
  'use strict';

  const ATAS_STORAGE_KEY = 'arca_atas_v1';

  // Coleção inicial fidedigna das Atas da Direção da ARCA
  const SEED_ATAS = [
    {
      id: 20,
      numero: 20,
      referencia: "020/1126",
      tipo: "Reunião de Direção",
      data: "2026-11-12",
      horaInicio: "14:00",
      horaFim: "15:30",
      local: "Grupo WhatsApp - Direção ARCA",
      presidiu: "Jorge Manuel da Silva Cunha",
      secretariou: "Raquel Alexandra Marques da Cunha",
      presencas: [
        { id: 1, nome: "Jorge Manuel da Silva Cunha", cargo: "Presidente", tipo: "membro" },
        { id: 2, nome: "Artur Jorge Ferreira Cardoso", cargo: "Tesoureiro", tipo: "membro" },
        { id: 4, nome: "Luis Carlos Antunes dos Santos", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 5, nome: "Raquel Alexandra Marques da Cunha", cargo: "Secretária", tipo: "membro" },
        { id: 6, nome: "Danilo Alexandre Estima Saraiva", cargo: "Vogal", tipo: "membro" }
      ],
      outrasPresencas: "Reunião extraordinária coordenada por via digital.",
      pontos: [
        {
          numero: 1,
          assunto: "Logística e organização dos Jogos de Futsal",
          discussao: "Foram analisadas as escalas de apoio ao pavilhão municipal, abertura de balneários e acolhimento dos árbitros e equipas visitantes para os próximos jogos das camadas jovens e seniores.",
          deliberacao: "Ficou aprovada a rotação de dirigentes para apoio aos jogos no pavilhão e validação dos lanches dos atletas.",
          votacao: { tipo: "Unanimidade", aFavor: 5, contra: 0, abstencao: 0 }
        }
      ],
      estado: "Rascunho",
      observacoes: "Minuta em conferência pelos membros da direção.",
      assinaturas: [
        { nome: "Jorge Manuel da Silva Cunha", cargo: "Presidente", estado: "Pendente", data: "" },
        { nome: "Raquel Alexandra Marques da Cunha", cargo: "Secretária", estado: "Pendente", data: "" }
      ],
      anexos: []
    },
    {
      id: 19,
      numero: 19,
      referencia: "019/1126",
      tipo: "Reunião de Direção",
      data: "2026-11-04",
      horaInicio: "17:30",
      horaFim: "19:45",
      local: "Grupo WhatsApp - Direção ARCA",
      presidiu: "Jorge Manuel da Silva Cunha",
      secretariou: "Raquel Alexandra Marques da Cunha",
      presencas: [
        { id: 1, nome: "Jorge Manuel da Silva Cunha", cargo: "Presidente", tipo: "membro" },
        { id: 2, nome: "Artur Jorge Ferreira Cardoso", cargo: "Tesoureiro", tipo: "membro" },
        { id: 3, nome: "José Manuel Carreira dos Reis", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 4, nome: "Luis Carlos Antunes dos Santos", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 5, nome: "Raquel Alexandra Marques da Cunha", cargo: "Secretária", tipo: "membro" },
        { id: 6, nome: "Danilo Alexandre Estima Saraiva", cargo: "Vogal", tipo: "membro" },
        { id: 7, nome: "Agostinho Rui Ferreira Martins", cargo: "Vogal", tipo: "membro" },
        { id: 8, nome: "Ana Catarina Rua Marques", cargo: "Vogal", tipo: "membro" },
        { id: 9, nome: "Gabriel Antunes das Neves Carlos", cargo: "Vogal", tipo: "membro" },
        { id: 10, nome: "Rui Miguel Baptista Abrantes", cargo: "Vogal", tipo: "membro" }
      ],
      outrasPresencas: "",
      pontos: [
        {
          numero: 1,
          assunto: "Logística e organização dos Jogos de Futsal",
          discussao: "Avaliação do transporte dos atletas e reforço do material desportivo.",
          deliberacao: "Aprovada a requisição de viatura e aquisição de 10 bolas oficiais.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 2,
          assunto: "Aniversário ARCA 40 anos · CONTINUAÇÃO",
          discussao: "Desenvolvimento do programa comemorativo dos 40 anos da ARCA e orçamentos para os brindes comemorativos aos sócios.",
          deliberacao: "Adjudicado o fabrico dos crachás e polos comemorativos.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 3,
          assunto: "Participação Enxorta Sopas do CENSI",
          discussao: "Convite endereçado pelo CENSI para a presença da ARCA na Noite das Sopas.",
          deliberacao: "Confirmada a participação com bancada e equipa de voluntários da ARCA.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 4,
          assunto: "Entrevista Notícias de Águeda",
          discussao: "Agendamento da entrevista institucional sobre a época desportiva e projetos culturais.",
          deliberacao: "Presidente Jorge Cunha e Secretária Raquel Cunha representarão a ARCA.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        }
      ],
      estado: "Rascunho",
      observacoes: "",
      assinaturas: [],
      anexos: []
    },
    {
      id: 18,
      numero: 18,
      referencia: "018/1026",
      tipo: "Reunião de Direção",
      data: "2026-10-28",
      horaInicio: "19:00",
      horaFim: "22:15",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      presidiu: "Jorge Manuel da Silva Cunha",
      secretariou: "Raquel Alexandra Marques da Cunha",
      presencas: [
        { id: 1, nome: "Jorge Manuel da Silva Cunha", cargo: "Presidente", tipo: "membro" },
        { id: 2, nome: "Artur Jorge Ferreira Cardoso", cargo: "Tesoureiro", tipo: "membro" },
        { id: 3, nome: "José Manuel Carreira dos Reis", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 4, nome: "Luis Carlos Antunes dos Santos", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 5, nome: "Raquel Alexandra Marques da Cunha", cargo: "Secretária", tipo: "membro" },
        { id: 6, nome: "Danilo Alexandre Estima Saraiva", cargo: "Vogal", tipo: "membro" },
        { id: 7, nome: "Agostinho Rui Ferreira Martins", cargo: "Vogal", tipo: "membro" },
        { id: 8, nome: "Ana Catarina Rua Marques", cargo: "Vogal", tipo: "membro" },
        { id: 9, nome: "Gabriel Antunes das Neves Carlos", cargo: "Vogal", tipo: "membro" },
        { id: 10, nome: "Rui Miguel Baptista Abrantes", cargo: "Vogal", tipo: "membro" },
        { id: 11, nome: "Sérgio Tiago Rodrigues Novo", cargo: "Vogal", tipo: "membro" }
      ],
      outrasPresencas: "",
      pontos: [
        {
          numero: 1,
          assunto: "Logística e organização dos Jogos de Futsal",
          discussao: "Disponibilidade de mesas de controlo e voluntários para a jornada de fim de semana.",
          deliberacao: "Escala validada.",
          votacao: { tipo: "Unanimidade", aFavor: 11, contra: 0, abstencao: 0 }
        },
        {
          numero: 2,
          assunto: "Valor Atletas futsal e BiciArca",
          discussao: "Apoios a atribuir aos escalões de formação e inscrições federativas do BiciArca.",
          deliberacao: "Fixados os valores de comparticipação e seguros desportivos.",
          votacao: { tipo: "Unanimidade", aFavor: 11, contra: 0, abstencao: 0 }
        },
        {
          numero: 3,
          assunto: "Convites Oficiais",
          discussao: "Envio de convites formais a entidades locais e parceiros.",
          deliberacao: "Aprovado o envio.",
          votacao: { tipo: "Unanimidade", aFavor: 11, contra: 0, abstencao: 0 }
        },
        {
          numero: 4,
          assunto: "Festa de Natal da Junta de Freguesia",
          discussao: "Colaboração da ARCA na logística da festa infantil de Natal.",
          deliberacao: "Cessão do pavilhão e colaboração ativa aprovadas.",
          votacao: { tipo: "Unanimidade", aFavor: 11, contra: 0, abstencao: 0 }
        },
        {
          numero: 5,
          assunto: "Noite das Sopas do CENSI",
          discussao: "Acertos finais de ingredientes e logística da banca.",
          deliberacao: "Designada a equipa de compras.",
          votacao: { tipo: "Unanimidade", aFavor: 11, contra: 0, abstencao: 0 }
        },
        {
          numero: 6,
          assunto: "Aniversário ARCA 40 anos",
          discussao: "Calendário geral dos eventos comemorativos ao longo de 2026/2027.",
          deliberacao: "Programa base aprovado por unanimidade.",
          votacao: { tipo: "Unanimidade", aFavor: 11, contra: 0, abstencao: 0 }
        }
      ],
      estado: "Rascunho",
      observacoes: "",
      assinaturas: [],
      anexos: []
    },
    {
      id: 17,
      numero: 17,
      referencia: "017/1026",
      tipo: "Reunião de Direção",
      data: "2026-10-21",
      horaInicio: "19:00",
      horaFim: "21:30",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      presidiu: "Jorge Manuel da Silva Cunha",
      secretariou: "Raquel Alexandra Marques da Cunha",
      presencas: [
        { id: 1, nome: "Jorge Manuel da Silva Cunha", cargo: "Presidente", tipo: "membro" },
        { id: 2, nome: "Artur Jorge Ferreira Cardoso", cargo: "Tesoureiro", tipo: "membro" },
        { id: 4, nome: "Luis Carlos Antunes dos Santos", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 5, nome: "Raquel Alexandra Marques da Cunha", cargo: "Secretária", tipo: "membro" },
        { id: 6, nome: "Danilo Alexandre Estima Saraiva", cargo: "Vogal", tipo: "membro" },
        { id: 7, nome: "Agostinho Rui Ferreira Martins", cargo: "Vogal", tipo: "membro" },
        { id: 8, nome: "Ana Catarina Rua Marques", cargo: "Vogal", tipo: "membro" },
        { id: 9, nome: "Gabriel Antunes das Neves Carlos", cargo: "Vogal", tipo: "membro" },
        { id: 10, nome: "Rui Miguel Baptista Abrantes", cargo: "Vogal", tipo: "membro" },
        { id: 12, nome: "Verónica Baptista Abrantes", cargo: "Vogal", tipo: "membro" }
      ],
      outrasPresencas: "",
      pontos: [
        {
          numero: 1,
          assunto: "Logística e organização dos Jogos de Futsal",
          discussao: "Vistoria técnica ao piso do pavilhão e rede de proteção.",
          deliberacao: "Reparações pontuais concluídas.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 2,
          assunto: "Aniversário ARCA 40 anos",
          discussao: "Contactos com antigos dirigentes e atletas para memorial histórico.",
          deliberacao: "Criação de comissão organizadora ad-hoc.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 3,
          assunto: "Merchandising da ARCA",
          discussao: "Novos artigos de merchandising: cachecóis, camisolas de treino e canecas.",
          deliberacao: "Aprovada encomenda de lote piloto.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        }
      ],
      estado: "Rascunho",
      observacoes: "",
      assinaturas: [],
      anexos: []
    },
    {
      id: 16,
      numero: 16,
      referencia: "016/1026",
      tipo: "Reunião de Direção",
      data: "2026-10-06",
      horaInicio: "19:00",
      horaFim: "21:00",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      presidiu: "Jorge Manuel da Silva Cunha",
      secretariou: "Raquel Alexandra Marques da Cunha",
      presencas: [
        { id: 1, nome: "Jorge Manuel da Silva Cunha", cargo: "Presidente", tipo: "membro" },
        { id: 2, nome: "Artur Jorge Ferreira Cardoso", cargo: "Tesoureiro", tipo: "membro" },
        { id: 3, nome: "José Manuel Carreira dos Reis", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 5, nome: "Raquel Alexandra Marques da Cunha", cargo: "Secretária", tipo: "membro" },
        { id: 6, nome: "Danilo Alexandre Estima Saraiva", cargo: "Vogal", tipo: "membro" },
        { id: 7, nome: "Agostinho Rui Ferreira Martins", cargo: "Vogal", tipo: "membro" },
        { id: 9, nome: "Gabriel Antunes das Neves Carlos", cargo: "Vogal", tipo: "membro" },
        { id: 11, nome: "Sérgio Tiago Rodrigues Novo", cargo: "Vogal", tipo: "membro" },
        { id: 12, nome: "Verónica Baptista Abrantes", cargo: "Vogal", tipo: "membro" }
      ],
      outrasPresencas: "",
      pontos: [
        {
          numero: 1,
          assunto: "Logística e organização dos Jogos de Futsal",
          discussao: "Planificação do arranque dos campeonatos distritais da AFA.",
          deliberacao: "Inscrições confirmadas e seguro regularizado.",
          votacao: { tipo: "Unanimidade", aFavor: 9, contra: 0, abstencao: 0 }
        },
        {
          numero: 2,
          assunto: "Aniversário ARCA 40 anos",
          discussao: "Primeira recolha de fotografias e atas antigas.",
          deliberacao: "Registo documental em curso.",
          votacao: { tipo: "Unanimidade", aFavor: 9, contra: 0, abstencao: 0 }
        },
        {
          numero: 3,
          assunto: "Merchandising da ARCA",
          discussao: "Propostas de design para a loja física e online.",
          deliberacao: "Aprovado design com o escudo oficial.",
          votacao: { tipo: "Unanimidade", aFavor: 9, contra: 0, abstencao: 0 }
        }
      ],
      estado: "Rascunho",
      observacoes: "",
      assinaturas: [],
      anexos: []
    },
    {
      id: 15,
      numero: 15,
      referencia: "015/0926",
      tipo: "Reunião de Direção",
      data: "2026-09-30",
      horaInicio: "19:00",
      horaFim: "22:00",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      presidiu: "Jorge Manuel da Silva Cunha",
      secretariou: "Raquel Alexandra Marques da Cunha",
      presencas: [
        { id: 1, nome: "Jorge Manuel da Silva Cunha", cargo: "Presidente", tipo: "membro" },
        { id: 2, nome: "Artur Jorge Ferreira Cardoso", cargo: "Tesoureiro", tipo: "membro" },
        { id: 3, nome: "José Manuel Carreira dos Reis", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 4, nome: "Luis Carlos Antunes dos Santos", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 5, nome: "Raquel Alexandra Marques da Cunha", cargo: "Secretária", tipo: "membro" },
        { id: 6, nome: "Danilo Alexandre Estima Saraiva", cargo: "Vogal", tipo: "membro" },
        { id: 10, nome: "Rui Miguel Baptista Abrantes", cargo: "Vogal", tipo: "membro" },
        { id: 11, nome: "Sérgio Tiago Rodrigues Novo", cargo: "Vogal", tipo: "membro" }
      ],
      outrasPresencas: "",
      pontos: [
        {
          numero: 1,
          assunto: "Balanço Jogos Sem Fronteiras (provisório)",
          discussao: "Apresentação dos resultados financeiros e adesão popular ao evento JSF.",
          deliberacao: "Saldo francamente positivo com louvor à equipa organizadora.",
          votacao: { tipo: "Unanimidade", aFavor: 8, contra: 0, abstencao: 0 }
        },
        {
          numero: 2,
          assunto: "Incidente nos jogos",
          discussao: "Análise da queixa disciplinar referente a comportamento no jogo de 20 de setembro.",
          deliberacao: "Encaminhado para parecer do Conselho Fiscal e advertência interna.",
          votacao: { tipo: "Unanimidade", aFavor: 8, contra: 0, abstencao: 0 }
        },
        {
          numero: 3,
          assunto: "Aniversário ARCA 40 anos",
          discussao: "Definição do lema e identidade visual das comemorações.",
          deliberacao: "Aprovado: 'ARCA: 40 Anos a Unir a Nossa Terra'.",
          votacao: { tipo: "Unanimidade", aFavor: 8, contra: 0, abstencao: 0 }
        },
        {
          numero: 4,
          assunto: "Balanço Financeiro",
          discussao: "Tesouraria apresenta o balancete do 3º trimestre.",
          deliberacao: "Aprovado balancete apresentado pelo Tesoureiro Artur Cardoso.",
          votacao: { tipo: "Unanimidade", aFavor: 8, contra: 0, abstencao: 0 }
        },
        {
          numero: 5,
          assunto: "Merchandising",
          discussao: "Avaliação do stock e preços de venda ao público.",
          deliberacao: "Tabela de preços homologada.",
          votacao: { tipo: "Unanimidade", aFavor: 8, contra: 0, abstencao: 0 }
        }
      ],
      estado: "Rascunho",
      observacoes: "",
      assinaturas: [],
      anexos: []
    },
    {
      id: 14,
      numero: 14,
      referencia: "014/0926",
      tipo: "Reunião de Direção",
      data: "2026-09-09",
      horaInicio: "18:45",
      horaFim: "22:30",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      presidiu: "Jorge Manuel da Silva Cunha",
      secretariou: "Raquel Alexandra Marques da Cunha",
      presencas: [
        { id: 1, nome: "Jorge Manuel da Silva Cunha", cargo: "Presidente", tipo: "membro" },
        { id: 2, nome: "Artur Jorge Ferreira Cardoso", cargo: "Tesoureiro", tipo: "membro" },
        { id: 3, nome: "José Manuel Carreira dos Reis", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 4, nome: "Luis Carlos Antunes dos Santos", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 5, nome: "Raquel Alexandra Marques da Cunha", cargo: "Secretária", tipo: "membro" },
        { id: 6, nome: "Danilo Alexandre Estima Saraiva", cargo: "Vogal", tipo: "membro" },
        { id: 7, nome: "Agostinho Rui Ferreira Martins", cargo: "Vogal", tipo: "membro" },
        { id: 8, nome: "Ana Catarina Rua Marques", cargo: "Vogal", tipo: "membro" },
        { id: 9, nome: "Gabriel Antunes das Neves Carlos", cargo: "Vogal", tipo: "membro" },
        { id: 10, nome: "Rui Miguel Baptista Abrantes", cargo: "Vogal", tipo: "membro" },
        { id: 11, nome: "Sérgio Tiago Rodrigues Novo", cargo: "Vogal", tipo: "membro" },
        { id: 12, nome: "Verónica Baptista Abrantes", cargo: "Vogal", tipo: "membro" }
      ],
      outrasPresencas: "",
      pontos: [
        {
          numero: 1,
          assunto: "Apresentação das Equipas (13/09)",
          discussao: "Gala de apresentação de todas as modalidades e atletas da época 2026/2027.",
          deliberacao: "Programa, iluminação e serviço de bar definidos.",
          votacao: { tipo: "Unanimidade", aFavor: 12, contra: 0, abstencao: 0 }
        },
        {
          numero: 2,
          assunto: "Jogos Sem Fronteiras",
          discussao: "Inscrições das equipas das freguesias e provas desportivas.",
          deliberacao: "Regulamento aprovado.",
          votacao: { tipo: "Unanimidade", aFavor: 12, contra: 0, abstencao: 0 }
        },
        {
          numero: 3,
          assunto: "Balanço Torneio Todos ARCA - Taça Jorginho",
          discussao: "Prestação de contas do torneio de futebol/futsal de verão.",
          deliberacao: "Aprovadas as contas do torneio com agradecimento à família do homenageado.",
          votacao: { tipo: "Unanimidade", aFavor: 12, contra: 0, abstencao: 0 }
        },
        {
          numero: 4,
          assunto: "Aniversário ARCA 40 anos",
          discussao: "Propostas preliminares.",
          deliberacao: "Prosseguir contactos.",
          votacao: { tipo: "Unanimidade", aFavor: 12, contra: 0, abstencao: 0 }
        },
        {
          numero: 5,
          assunto: "Bancadas do Pavilhão",
          discussao: "Manutenção e pintura das bancadas do pavilhão desportivo.",
          deliberacao: "Aprovada contratação dos serviços.",
          votacao: { tipo: "Unanimidade", aFavor: 12, contra: 0, abstencao: 0 }
        },
        {
          numero: 6,
          assunto: "Pavilhão para jogos das femininas nos nacionais",
          discussao: "Requisitos da Federação Portuguesa de Futebol para a receção de jogos nacionais.",
          deliberacao: "Garantidas as adaptações técnicas solicitadas.",
          votacao: { tipo: "Unanimidade", aFavor: 12, contra: 0, abstencao: 0 }
        },
        {
          numero: 7,
          assunto: "Balanço Financeiro",
          discussao: "Análise de despesas de verão.",
          deliberacao: "Aprovado.",
          votacao: { tipo: "Unanimidade", aFavor: 12, contra: 0, abstencao: 0 }
        },
        {
          numero: 8,
          assunto: "Outros Assuntos",
          discussao: "Submissão de candidaturas a subsídios da Câmara Municipal de Águeda.",
          deliberacao: "Instrução do processo aprovada.",
          votacao: { tipo: "Unanimidade", aFavor: 12, contra: 0, abstencao: 0 }
        }
      ],
      estado: "Rascunho",
      observacoes: "",
      assinaturas: [],
      anexos: []
    },
    {
      id: 13,
      numero: 13,
      referencia: "013/0926",
      tipo: "Reunião de Direção",
      data: "2026-09-03",
      horaInicio: "21:15",
      horaFim: "23:45",
      local: "Torneio Todos ARCA - Taça Jorginho",
      presidiu: "Jorge Manuel da Silva Cunha",
      secretariou: "Raquel Alexandra Marques da Cunha",
      presencas: [
        { id: 1, nome: "Jorge Manuel da Silva Cunha", cargo: "Presidente", tipo: "membro" },
        { id: 2, nome: "Artur Jorge Ferreira Cardoso", cargo: "Tesoureiro", tipo: "membro" },
        { id: 4, nome: "Luis Carlos Antunes dos Santos", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 5, nome: "Raquel Alexandra Marques da Cunha", cargo: "Secretária", tipo: "membro" },
        { id: 6, nome: "Danilo Alexandre Estima Saraiva", cargo: "Vogal", tipo: "membro" },
        { id: 7, nome: "Agostinho Rui Ferreira Martins", cargo: "Vogal", tipo: "membro" },
        { id: 9, nome: "Gabriel Antunes das Neves Carlos", cargo: "Vogal", tipo: "membro" },
        { id: 10, nome: "Rui Miguel Baptista Abrantes", cargo: "Vogal", tipo: "membro" }
      ],
      outrasPresencas: "",
      pontos: [
        {
          numero: 1,
          assunto: "Torneio Todos ARCA - Taça Jorginho",
          discussao: "Organização das finais do torneio e cerimónia de entrega de troféus.",
          deliberacao: "Aprovado o protocolo de encerramento.",
          votacao: { tipo: "Unanimidade", aFavor: 8, contra: 0, abstencao: 0 }
        },
        {
          numero: 2,
          assunto: "Apresentação de Equipas",
          discussao: "Convite a padrinhos desportivos.",
          deliberacao: "Contactos efetuados com sucesso.",
          votacao: { tipo: "Unanimidade", aFavor: 8, contra: 0, abstencao: 0 }
        },
        {
          numero: 3,
          assunto: "Participação na Taça de Portugal - Seniores Femininas",
          discussao: "Inscrição formal na Taça de Portugal e custos de deslocação.",
          deliberacao: "Inscrição aprovada.",
          votacao: { tipo: "Unanimidade", aFavor: 8, contra: 0, abstencao: 0 }
        },
        {
          numero: 4,
          assunto: "Formação FCS",
          discussao: "Inscrição de treinadores em ações de formação creditada.",
          deliberacao: "Comparticipação de 50% pela ARCA.",
          votacao: { tipo: "Unanimidade", aFavor: 8, contra: 0, abstencao: 0 }
        }
      ],
      estado: "Rascunho",
      observacoes: "",
      assinaturas: [],
      anexos: []
    },
    {
      id: 12,
      numero: 12,
      referencia: "012/0826",
      tipo: "Reunião de Direção",
      data: "2026-08-19",
      horaInicio: "21:15",
      horaFim: "23:30",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      presidiu: "Jorge Manuel da Silva Cunha",
      secretariou: "Raquel Alexandra Marques da Cunha",
      presencas: [
        { id: 1, nome: "Jorge Manuel da Silva Cunha", cargo: "Presidente", tipo: "membro" },
        { id: 2, nome: "Artur Jorge Ferreira Cardoso", cargo: "Tesoureiro", tipo: "membro" },
        { id: 3, nome: "José Manuel Carreira dos Reis", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 4, nome: "Luis Carlos Antunes dos Santos", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 5, nome: "Raquel Alexandra Marques da Cunha", cargo: "Secretária", tipo: "membro" },
        { id: 6, nome: "Danilo Alexandre Estima Saraiva", cargo: "Vogal", tipo: "membro" },
        { id: 7, nome: "Agostinho Rui Ferreira Martins", cargo: "Vogal", tipo: "membro" },
        { id: 8, nome: "Ana Catarina Rua Marques", cargo: "Vogal", tipo: "membro" },
        { id: 10, nome: "Rui Miguel Baptista Abrantes", cargo: "Vogal", tipo: "membro" },
        { id: 11, nome: "Sérgio Tiago Rodrigues Novo", cargo: "Vogal", tipo: "membro" }
      ],
      outrasPresencas: "",
      pontos: [
        {
          numero: 1,
          assunto: "Fisioterapeuta: diligências equipas",
          discussao: "Contratação de apoio fisioterapêutico para a época sénior e formação.",
          deliberacao: "Protocolo de colaboração com clínica especializada aprovado.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 2,
          assunto: "Fichas técnicas",
          discussao: "Uniformização dos processos clínicos e de aptidão física dos atletas.",
          deliberacao: "Novo modelo digital aprovado.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 3,
          assunto: "Diretor Desportivo",
          discussao: "Relatório de pré-época apresentado pelo Diretor Desportivo.",
          deliberacao: "Relatório acolhido com voto de confiança.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 4,
          assunto: "Planeamento de equipas",
          discussao: "Número de atletas inscritos por escalão.",
          deliberacao: "Confirmados 5 escalões competitivos.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 5,
          assunto: "Equipamentos e patrocínio",
          discussao: "Novos patrocinadores oficiais para as camisolas de jogo.",
          deliberacao: "Aprovados os contratos de patrocínio negociados pela Tesouraria.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        }
      ],
      estado: "Rascunho",
      observacoes: "",
      assinaturas: [],
      anexos: []
    },
    {
      id: 11,
      numero: 11,
      referencia: "011/0726",
      tipo: "Reunião de Direção",
      data: "2026-07-29",
      horaInicio: "21:15",
      horaFim: "23:55",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      presidiu: "Jorge Manuel da Silva Cunha",
      secretariou: "Raquel Alexandra Marques da Cunha",
      presencas: [
        { id: 1, nome: "Jorge Manuel da Silva Cunha", cargo: "Presidente", tipo: "membro" },
        { id: 2, nome: "Artur Jorge Ferreira Cardoso", cargo: "Tesoureiro", tipo: "membro" },
        { id: 3, nome: "José Manuel Carreira dos Reis", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 4, nome: "Luis Carlos Antunes dos Santos", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 5, nome: "Raquel Alexandra Marques da Cunha", cargo: "Secretária", tipo: "membro" },
        { id: 6, nome: "Danilo Alexandre Estima Saraiva", cargo: "Vogal", tipo: "membro" },
        { id: 8, nome: "Ana Catarina Rua Marques", cargo: "Vogal", tipo: "membro" },
        { id: 9, nome: "Gabriel Antunes das Neves Carlos", cargo: "Vogal", tipo: "membro" },
        { id: 10, nome: "Rui Miguel Baptista Abrantes", cargo: "Vogal", tipo: "membro" },
        { id: 12, nome: "Verónica Baptista Abrantes", cargo: "Vogal", tipo: "membro" }
      ],
      outrasPresencas: "",
      pontos: [
        {
          numero: 1,
          assunto: "AgitÁgueda: Balanço e Resumos",
          discussao: "Balanço da participação da tasquinha da ARCA no festival AgitÁgueda.",
          deliberacao: "Receitas superaram as expectativas; louvor a todos os voluntários.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 2,
          assunto: "Rota das Minis e Taça Jorginho",
          discussao: "Preparação dos eventos de verão.",
          deliberacao: "Comissões de trabalho ativadas.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 3,
          assunto: "Fisioterapeuta",
          discussao: "Levantamento de necessidades.",
          deliberacao: "Aprovado.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 4,
          assunto: "Encerramento pavilhão ARCA em agosto",
          discussao: "Período de encerramento para obras de pintura e manutenção.",
          deliberacao: "Encerramento de 1 a 24 de agosto de 2026.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 5,
          assunto: "Sistema POS",
          discussao: "Instalação do novo terminal de pagamento automático para bar e quotas.",
          deliberacao: "Contratação do serviço com a entidade bancária aprovada.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 6,
          assunto: "Diligências de inscrições de equipas",
          discussao: "Prazos da Associação de Futebol de Aveiro.",
          deliberacao: "Cumprimento dos prazos garantido.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 7,
          assunto: "Incidente com Sócio 425",
          discussao: "Análise da ocorrência disciplinar.",
          deliberacao: "Enviada notificação para audição presencial.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        },
        {
          numero: 8,
          assunto: "Saldos ARCA até à Data",
          discussao: "Apresentação dos saldos bancários e fecho provisório.",
          deliberacao: "Homologado relatório da tesouraria.",
          votacao: { tipo: "Unanimidade", aFavor: 10, contra: 0, abstencao: 0 }
        }
      ],
      estado: "Rascunho",
      observacoes: "",
      assinaturas: [],
      anexos: []
    },
    {
      id: 10,
      numero: 10,
      referencia: "010/0726",
      tipo: "Reunião de Direção",
      data: "2026-07-09",
      horaInicio: "21:00",
      horaFim: "23:00",
      local: "AgitÁgueda",
      presidiu: "Jorge Manuel da Silva Cunha",
      secretariou: "Raquel Alexandra Marques da Cunha",
      presencas: [
        { id: 1, nome: "Jorge Manuel da Silva Cunha", cargo: "Presidente", tipo: "membro" },
        { id: 2, nome: "Artur Jorge Ferreira Cardoso", cargo: "Tesoureiro", tipo: "membro" },
        { id: 3, nome: "José Manuel Carreira dos Reis", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 4, nome: "Luis Carlos Antunes dos Santos", cargo: "Vice-Presidente", tipo: "membro" },
        { id: 5, nome: "Raquel Alexandra Marques da Cunha", cargo: "Secretária", tipo: "membro" },
        { id: 6, nome: "Danilo Alexandre Estima Saraiva", cargo: "Vogal", tipo: "membro" },
        { id: 7, nome: "Agostinho Rui Ferreira Martins", cargo: "Vogal", tipo: "membro" },
        { id: 10, nome: "Rui Miguel Baptista Abrantes", cargo: "Vogal", tipo: "membro" },
        { id: 11, nome: "Sérgio Tiago Rodrigues Novo", cargo: "Vogal", tipo: "membro" }
      ],
      outrasPresencas: "",
      pontos: [
        {
          numero: 1,
          assunto: "AgitÁgueda: Abertura da Tasquinha",
          discussao: "Organização dos primeiros dias de funcionamento no recinto do AgitÁgueda.",
          deliberacao: "Escala de voluntários preenchida na íntegra.",
          votacao: { tipo: "Unanimidade", aFavor: 9, contra: 0, abstencao: 0 }
        },
        {
          numero: 2,
          assunto: "Rota das Minis e Taça Jorginho",
          discussao: "Coordenação dos apoios e patrocínios locais.",
          deliberacao: "Inscrições abertas aos associados e simpatizantes.",
          votacao: { tipo: "Unanimidade", aFavor: 9, contra: 0, abstencao: 0 }
        },
        {
          numero: 3,
          assunto: "Incidente com Sócio 425",
          discussao: "Primeira comunicação dos factos ocorridos nas imediações do pavilhão.",
          deliberacao: "Instauração de averiguação prévia.",
          votacao: { tipo: "Unanimidade", aFavor: 9, contra: 0, abstencao: 0 }
        }
      ],
      estado: "Aprovada",
      observacoes: "Ata formalmente lida, votada e aprovada por unanimidade na reunião seguinte.",
      assinaturas: [
        { nome: "Jorge Manuel da Silva Cunha", cargo: "Presidente", estado: "Assinado", data: "2026-07-29" },
        { nome: "Raquel Alexandra Marques da Cunha", cargo: "Secretária", estado: "Assinado", data: "2026-07-29" }
      ],
      anexos: []
    },
    {
      "id": 9,
      "numero": 9,
      "referencia": "009/0726",
      "tipo": "Reunião de Direção",
      "data": "2026-07-01",
      "horaInicio": "21:00",
      "horaFim": "",
      "local": "Pavilhão Carlos Almeida, Aguada de Baixo",
      "presidiu": "Jorge Manuel da Silva Cunha",
      "secretariou": "Raquel Alexandra Marques da Cunha",
      "presencas": [
        {
          "id": 1,
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "tipo": "membro"
        },
        {
          "id": 2,
          "nome": "Artur Jorge Ferreira Cardoso",
          "cargo": "Tesoureiro",
          "tipo": "membro"
        },
        {
          "id": 4,
          "nome": "Luis Carlos Antunes dos Santos",
          "cargo": "Vice-Presidente",
          "tipo": "membro"
        },
        {
          "id": 7,
          "nome": "Agostinho Rui Ferreira Martins",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 9,
          "nome": "Gabriel Antunes das Neves Carlos",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 11,
          "nome": "Sérgio Tiago Rodrigues Novo",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 12,
          "nome": "Verónica Baptista Abrantes",
          "cargo": "Vogal",
          "tipo": "membro"
        }
      ],
      "outrasPresencas": "",
      "pontos": [
        {
          "numero": 1,
          "assunto": "Convívio Andebol",
          "discussao": "Proximo sabado, dia 4 continua de atualidade,\n- Ajudamos na sexta, depois das 18/19:00, preparamos as coisas para o Zé Manel em pouquinho tempo.\n- Mal entendidos esclarecidos",
          "deliberacao": "Disponíveis: Rui; Agostinho; Ana Rua, Jorge",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 7,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 2,
          "assunto": "Rota das Minis e Taça Jorginho",
          "discussao": "- Dia 5 de setembro, Taça Jorginho, Jorge Ferreira não poderá ajudar no dia, mas vai organizar e preparar tudo na mesma",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 7,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 3,
          "assunto": "T-shirt",
          "discussao": "- Balanço pré reserva\n- Encomenda?\n- 68 unidade - 964,38 euros de encomenda - 1624,00€ brutos vendido - lucro estimado 659,62€",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 7,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 4,
          "assunto": "Peregrinos dia 7 de julho",
          "discussao": "Proxima 3ª feira, pavlhão ocupado de terça para quarta, fazemos o jantar, combinado carne porco alentejana\nZé Reis, Rui, Luís, Artur, Jorge ajudam",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 7,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 5,
          "assunto": "3ª edição Torneio Arca Millwire",
          "discussao": "Competição futsal feminino, 11/julho\nPonto de situação\nO que necessitam de restante direção e do presidente?",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 7,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 6,
          "assunto": "AgitÁgueda",
          "discussao": "- Ver plano de ação e organização\n- encomenda de barris cerveja, sangria e somersby??\nEquipas\nDonativos\nComidas\n- fazer t-shirts para o evento (e dar às ajudas e AJSL) aventais?",
          "deliberacao": "Disponibilidades: todos mostraram disponibilidade. Luís organiza escalas. Turnos de jantar: 19h; 20h; 21h. Cerciag leva praticamente todo o material para as 3 semanas.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 7,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 7,
          "assunto": "Rota das Minis e Taça Jorginho",
          "discussao": "- Dia 5 de setembro, Taça Jorginho, Jorge Ferreira não poderá ajudar no dia, mas vai organizar e preparar tudo na mesma",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 7,
            "contra": 0,
            "abstencao": 0
          }
        }
      ],
      "estado": "Rascunho",
      "observacoes": "Ata importada do Excel (folha 0701).",
      "assinaturas": [
        {
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "estado": "Pendente",
          "data": ""
        },
        {
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "estado": "Pendente",
          "data": ""
        }
      ],
      "anexos": []
    },
    {
      "id": 8,
      "numero": 8,
      "referencia": "008/0626",
      "tipo": "Reunião de Direção",
      "data": "2026-06-25",
      "horaInicio": "21:00",
      "horaFim": "",
      "local": "Pavilhão Carlos Almeida, Aguada de Baixo",
      "presidiu": "Jorge Manuel da Silva Cunha",
      "secretariou": "Raquel Alexandra Marques da Cunha",
      "presencas": [
        {
          "id": 1,
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "tipo": "membro"
        },
        {
          "id": 2,
          "nome": "Artur Jorge Ferreira Cardoso",
          "cargo": "Tesoureiro",
          "tipo": "membro"
        },
        {
          "id": 3,
          "nome": "José Manuel Carreira dos Reis",
          "cargo": "Vice-Presidente",
          "tipo": "membro"
        },
        {
          "id": 4,
          "nome": "Luis Carlos Antunes dos Santos",
          "cargo": "Vice-Presidente",
          "tipo": "membro"
        },
        {
          "id": 5,
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "tipo": "membro"
        },
        {
          "id": 6,
          "nome": "Danilo Alexandre Estima Saraiva",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 7,
          "nome": "Agostinho Rui Ferreira Martins",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 8,
          "nome": "Ana Catarina Rua Marques",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 9,
          "nome": "Gabriel Antunes das Neves Carlos",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 10,
          "nome": "Rui Miguel Baptista Abrantes",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 12,
          "nome": "Verónica Baptista Abrantes",
          "cargo": "Vogal",
          "tipo": "membro"
        }
      ],
      "outrasPresencas": "",
      "pontos": [
        {
          "numero": 1,
          "assunto": "Dia da Freguesia - Balanços",
          "discussao": "Balanço\nLiquido BRUTO recebido 2007,45 - \n  -  Liq 1528,14 (c/credit) + TPA 479,31(! retirado cauções camisolas 139,00 no liquido)\nBalanço: 2007,45 - despesas 1035,15 = Lucro final 972,30",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 2,
          "assunto": "EVENTO Ciclorturismo, domingo 14",
          "discussao": "Balanço\nLiquido BRUTO recebido= Liq 474,28 + TPA 209,22 - despesas 371,90 = \nLucro final 341,60",
          "deliberacao": "trabalhar grupo Whatsapp para garantir maior aderência no próximo ano",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 3,
          "assunto": "T-shirt",
          "discussao": "- Balanço pré reserva\n- Encomenda?\n- Pequena questão com os valores, uns pagaram 20€ ou menos, Direção como por exemplo Artur tem de pagar 25€?",
          "deliberacao": "(valor da camsiola ronda os 15€, personalizado) 25€ sócio; 30€ não sócio; a partir da segunda t-shirt, a terceira fica a 20€. Atletas inscritas ficam a 20€",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 4,
          "assunto": "Peregrinos dia 7 de julho",
          "discussao": "- Pensar no jantar\n- Quem pode ajudar?",
          "deliberacao": "Disponibilidades: Zé Reis, Rui, Luís, Artur, Jorge. Comer: carne porco alentejana?",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 5,
          "assunto": "3ª edição Torneio Arca Millwire",
          "discussao": "Competição futsal feminino, 11/julho\nPonto de situação\nO que necessitam de restante direção e do presidente?",
          "deliberacao": "80€ inscrição; prémio altera consoante o número de equipas; taças? Minimo de torneio: 4 equipas. A Ana consegue ter a equipa das femininas para agilizar bar",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 6,
          "assunto": "AgitÁgueda",
          "discussao": "- Ver plano de ação e organização\nEquipas\nDonativos\nComidas\n- fazer t-shirts para o evento (e dar às ajudas e AJSL) aventais?",
          "deliberacao": "Disponibilidades: todos mostraram disponibilidade. Luís organiza escalas. Turnos de jantar: 19h; 20h; 21h. Cerciag leva praticamente todo o material para as 3 semanas.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 7,
          "assunto": "Nova data Rota das Minis e Taça Jorginho",
          "discussao": "- Dia 5 de setembro",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 8,
          "assunto": "Ponto situação legalização terrenos e pavilhão",
          "discussao": "Assunto apresentado à direção.",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 9,
          "assunto": "Sábado, 04-julho",
          "discussao": "Encontro Andebol",
          "deliberacao": "Disponíveis: Rui; Agostinho; Ana Rua, Jorge",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        }
      ],
      "estado": "Rascunho",
      "observacoes": "Ata importada do Excel (folha 0625).",
      "assinaturas": [
        {
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "estado": "Pendente",
          "data": ""
        },
        {
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "estado": "Pendente",
          "data": ""
        }
      ],
      "anexos": []
    },
    {
      "id": 7,
      "numero": 7,
      "referencia": "007/0626",
      "tipo": "Reunião de Direção",
      "data": "2026-06-11",
      "horaInicio": "21:00",
      "horaFim": "",
      "local": "Pavilhão Carlos Almeida, Aguada de Baixo",
      "presidiu": "Jorge Manuel da Silva Cunha",
      "secretariou": "Raquel Alexandra Marques da Cunha",
      "presencas": [
        {
          "id": 1,
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "tipo": "membro"
        },
        {
          "id": 2,
          "nome": "Artur Jorge Ferreira Cardoso",
          "cargo": "Tesoureiro",
          "tipo": "membro"
        },
        {
          "id": 3,
          "nome": "José Manuel Carreira dos Reis",
          "cargo": "Vice-Presidente",
          "tipo": "membro"
        },
        {
          "id": 4,
          "nome": "Luis Carlos Antunes dos Santos",
          "cargo": "Vice-Presidente",
          "tipo": "membro"
        },
        {
          "id": 5,
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "tipo": "membro"
        },
        {
          "id": 6,
          "nome": "Danilo Alexandre Estima Saraiva",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 7,
          "nome": "Agostinho Rui Ferreira Martins",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 8,
          "nome": "Ana Catarina Rua Marques",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 9,
          "nome": "Gabriel Antunes das Neves Carlos",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 12,
          "nome": "Verónica Baptista Abrantes",
          "cargo": "Vogal",
          "tipo": "membro"
        }
      ],
      "outrasPresencas": "",
      "pontos": [
        {
          "numero": 1,
          "assunto": "Dia da Freguesia - Balanços",
          "discussao": "- Deverei ter as contas finais na semana que vem\n\n- Outros balanços",
          "deliberacao": "Feedback positivo por todos os membros da Direção; muita aderência; a iniciativa do comércio local foi mt positiva. Estima-se um lucro de 800€",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 2,
          "assunto": "Enceramento Época de Futsal - Dia 7 do DF",
          "discussao": "- Balanço",
          "deliberacao": "Próximo ano fazer encerramento da época numa data diferente do Dia da Freguesia",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 3,
          "assunto": "EVENTO Ciclorturismo, domingo 14",
          "discussao": "Disponibilidade e Função\nJorge Cunha · M/T · Sérgio Novo · M/T · Manhã\nArtur Cardoso · M/T · Rui Abrantes · 9\nDanilo Saraiva · M/T · Gabriel Carlos · M/T · Tarde\nJosé Reis · Verónica Abrantes · M/T · 9\nLuis Santos · M/T · Ana Rua Marques\nRaquel Cunha · M/T · Agostinho Martins · M/T\n- O brinde será um saco banana, se o fulano não falhar!\n\n- Quem pode fazer ou comprar (pagamos) sobremesas, bolos?\n\nOrdem de trabalhos no Cicloturismo:\nSABADO\n- Fazer compras finais, e coisas para as paragens.\n- preparar algumas coisas que não devem demorar muito, como os brindes, aguas, senhas, a mesa para receber as inscrições, etc…\n- Fechar o parque do lado da carrinha à noite\n\nDOMINGO\n8:00 \n- Preparar a carrinha com o som carrinha ARCA (Lena do Costa e Natália leva) e carro voussoura (João Pais?).\n- Som ambiente exterior\n- Por a mesa de fora para as inscrições, dispor fichas, e começar a receber as pessoas, entregar brindes, aguas\n- Preparar as coisas para as paragens, bolos, bananas, chmaparião, aguas, copos, mesas, etc...\n\n>>>Preparar para os cicloturistas saírem e assim que saírem\n- Preparar as coisas para o almoço\n* Comida almoço, febra/tiras/salsichas encomendar na vespera/ou durante a manhã de domingo\n  na brasa+arroz com legumes+salada, sobremesas, fazer compras...\n- montamos o bar e churrasqueira por baixo do telheiro, montamos tendas no parque, mesas, cadeiras, etc.\n- Assim que convier, inicia-se o churrasco e a comida\n \n12:30/13:00 – Prepara para a chegada dos cicloturistas.\nVamos assegurando as coisas durante a tarde.\nPeço-vos para aproveitem a tarde e divertirem-se tambem.\nFinal do evento, arrumar as coisas, limpar, e balanço.",
          "deliberacao": "Bolos - Kika, Raquel, Artur; Gabriel. Sábado reunir pelas 11h00: Jorge, Danilo, Artur, Raquel, Agostinho. Domingo juntar pelas 08h00. Carro-vassoura: João Pais/ Hilário. Sérgio de mota no Cicloturismo para parar em cruzamentos. Paragens: Parque Sabugueiro; capela da Forcada.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 4,
          "assunto": "T-shirt",
          "discussao": "- Balanço pré reserva",
          "deliberacao": "(valor da camsiola ronda os 15€, personalizado) 25€ sócio; 30€ não sócio; sem personalização 20€; outro valor para pré-reserva?",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 5,
          "assunto": "Logotipos bordados",
          "discussao": "Balanço logotipos.\n- mandamos fazer mais alguns outras medidas\n- preço para venda",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 6,
          "assunto": "Futsal Feminino",
          "discussao": "Jogo Arca x Tabuense. Foram encaminhados para Espariz, pavilhão sem condições, árbitros sem respeito.",
          "deliberacao": "Fazer queixas à AFA.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 7,
          "assunto": "AgitÁgueda - Questão AJSL",
          "discussao": "- Propusemos dar 3 dias à AJSL, a começar no domingo 12 até 3ªfeira 14",
          "deliberacao": "resturantes: Convívio; Nelita; Zé Lopes (frangos); Quim; Glória; Zé Manel?; Artur (bacalhau espiritual); o que sai sempre: rojões; pica-paus; moelas; bacalhau com natas. Pessoas fixas para empretar: Silvi e Artur? 1 pessoa no caixa; 1 na loiça; 1 no café; 3 pessoas para servir",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 8,
          "assunto": "Treinadores",
          "discussao": "Foi feita conversa com Alexandre Manaia, para continuar a treinar. O Alexandre preferia não ser treinador e sim \"preperador físico\", abdicando do salário. Pensou-se em Filipe Pina (com a \"preocupação\" com as asneiras e maneiras como tratam os árbitros, outros jogadores, etc). Futsal Feminino: já se falou com o treinador Diogo.",
          "deliberacao": "Diogo aceita os valores 175€.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 9,
          "assunto": "Taça Jorginho",
          "discussao": "Taça Jorginho aponta-se para dia 25/julho, a iniciar de manhã",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 10,
          "assunto": "3ª edição Arca Millwire",
          "discussao": "Competição futsal feminino, 11/julho",
          "deliberacao": "80€ inscrição; prémio altera consoante o número de equipas; taças?",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        }
      ],
      "estado": "Rascunho",
      "observacoes": "Ata importada do Excel (folha 0611).",
      "assinaturas": [
        {
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "estado": "Pendente",
          "data": ""
        },
        {
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "estado": "Pendente",
          "data": ""
        }
      ],
      "anexos": []
    },
    {
      "id": 6,
      "numero": 6,
      "referencia": "006/0626",
      "tipo": "Reunião de Direção",
      "data": "2026-06-03",
      "horaInicio": "21:00",
      "horaFim": "",
      "local": "Pavilhão Carlos Almeida, Aguada de Baixo",
      "presidiu": "Jorge Manuel da Silva Cunha",
      "secretariou": "Raquel Alexandra Marques da Cunha",
      "presencas": [
        {
          "id": 1,
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "tipo": "membro"
        },
        {
          "id": 3,
          "nome": "José Manuel Carreira dos Reis",
          "cargo": "Vice-Presidente",
          "tipo": "membro"
        },
        {
          "id": 4,
          "nome": "Luis Carlos Antunes dos Santos",
          "cargo": "Vice-Presidente",
          "tipo": "membro"
        },
        {
          "id": 5,
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "tipo": "membro"
        },
        {
          "id": 6,
          "nome": "Danilo Alexandre Estima Saraiva",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 8,
          "nome": "Ana Catarina Rua Marques",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 9,
          "nome": "Gabriel Antunes das Neves Carlos",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 10,
          "nome": "Rui Miguel Baptista Abrantes",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 11,
          "nome": "Sérgio Tiago Rodrigues Novo",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 12,
          "nome": "Verónica Baptista Abrantes",
          "cargo": "Vogal",
          "tipo": "membro"
        }
      ],
      "outrasPresencas": "",
      "pontos": [
        {
          "numero": 1,
          "assunto": "Logistica e organização dos Jogos de Futsal",
          "discussao": "Jogo · CASA · Domingo · 07/06/2026 · 19:00 · Femininos · Casa Povo Miranda Corvo\nPCS: Rui Abrantes · Danilo Saraiva · Jorge Cunha\nBar: Agostinho Martins\nBilheteira: Raquel Cunha",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 2,
          "assunto": "Dia da Freguesia, 6 e 7 de Junho - PROXIMO EVENTO",
          "discussao": "Disponibilidade e Função\nJorge Cunha · M/T/N · M/T · Sérgio Novo · M/T/N · M/T · Manhã\nArtur Cardoso · Rui Abrantes · M/T · M/T · 7\nDanilo Saraiva · Gabriel Carlos · Tarde\nJosé Reis · M/T/N · M/T · Verónica Abrantes · N · M/T · 7\nLuis Santos · Ana Rua Marques · M/T/N · Noite\nRaquel Cunha · M/T/N · M/T · Agostinho Martins · M/T/N · M/T · 7\n- Foi mandado emoldurar as t-shirts de homenagem\n- Que fazemos de encerramento no domingo?\nSABADO\n- manhã preparar bar/mercadoria, loiça, etc...\n- não servimos almoço, ficou para as outras associações, mas abrimos o BAR servimos bebidas, cafés...servimos cachorros, petiscos??\n- Jantar será feito um grelhados em conjunto com associações CENSI/APAB, cerca de 50 febras cada, mandamos fazer uma panela de sopa caldo verde, + petiscos?\nDOMINGO\n- abrimos o bar, petiscos, durante o passeio das motos/carros, o almoço é oferecido pela junta, mas temos ser nós e as outras associações a servir.\n- preparamos mesas para os atletas/orgãos? ou usão o espaço? Podemos servir espumante aos nossos\n- podemos ter sangria nos dois dias",
          "deliberacao": "Sábado manhã: montar barraca e abrir bar; \"almoço\" (cachorros, batatas fritas, chocolates, café); fazer sangria; jantar: churrasco e caldo verde entre associações (censi, arca e apab);",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 3,
          "assunto": "Enceramento Época de Futsal - Dia 7 do DF",
          "discussao": "O almoço é oferecido pela JF, mas podemos acrescentar mais alguma coisa, champanhe, bebidas, sobremesas à nossa mesa\n- O que fazemos como oferta ou cerimonia?",
          "deliberacao": "Discurso de agradecimento pelo empenho; oferecer emblema; mandar fazer um bolo \"encerramento época 25/26\"",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 4,
          "assunto": "EVENTO Ciclorturismo, domingo 14",
          "discussao": "Disponibilidade e Função\nJorge Cunha · M/T · Sérgio Novo · M/T · Manhã\nArtur Cardoso · Rui Abrantes · 8\nDanilo Saraiva · M/T · Gabriel Carlos · M/T · Tarde\nJosé Reis · Verónica Abrantes · M/T · 7\nLuis Santos · M/T · Ana Rua Marques\nRaquel Cunha · M · Agostinho Martins · M/T\nOrdem de trabalhos no Cicloturismo:\n- O brinde será um saco banana\n* Precisamos de uma carrinha carro vassoura\n* Preparar som carrinha ARCA, Lena do Costa e Natália costuma levar, sogra e mãe Luis ?\n* Comida almoço, febra/tiras/salsichas encomendar na vespera/ou durante a mnhã de sabado\n  na brasa+arroz de feijão+salada, sobremesas, fazer compras...\n* Fazemos como no ano passado, montamos o bar e churrasqueira por baixo do telheiro, montamos tendas no parque, mesas, cadeiras, etc.\n\nCronologia de trabalhos:\n-Sexta \nSe possivel reunir na sexta, preparar algumas coisas que não devem demorar muito, como os brindes, aguas, senhas, a mesa para receber as inscrições, etc…\n-Sabado \n7:45/8:00 – Por a mesa de fora para as inscrições, dispor fichas, e começar a receber as pessoas, entregar brindes, aguas. Um grupo prepara as carrinha, o champarrião, etc\n9:00 – Preparar para os cicloturistas saírem e assim que saírem, um grupo prepara, as coisas para as paragens (champarrião/bananas/bolos/copos,etc..). Outro grupo prepara as tendas, a zona do bar e churrasqueira, mesas/cadeiras, etc. Vamos preparando a comida, saladas, arroz, e iniciar o churrascada\n12:30/13:00 – Prepara para a chegada dos cicloturistas.\nVamos assegurando as coisas durante a tarde.\nPeço-vos para aproveitem a tarde e divertirem-se tambem.\nFinal do evento, arrumar as coisas, limpar, e balanço.",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 5,
          "assunto": "T-shirt",
          "discussao": "- Já temos a prova da t-shirt comemorativa.\nestrategias de venda e valores?",
          "deliberacao": "(valor da camsiola ronda os 15€, personalizado) 25€ sócio; 30€ não sócio; sem personalização 20€; outro valor para pré-reserva?",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 6,
          "assunto": "Logotipos bordados",
          "discussao": "- Mandei fazer logotipos bordados grandes e pequenos\n   oferecemos aos atletas e depois vendemos\n   ou\n   pomos a venda logo no sabado",
          "deliberacao": "emblemas de oferta para atletas; mais tarde tenta-se vender",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 7,
          "assunto": "Vemos o que temos que podemos vender",
          "discussao": "- Podemos fazer uma seleção do que temos (old brindes) e tentamos vendar no DF?",
          "deliberacao": "Ideia: cremesse para o agitagueda (chapeus, garrafas, t-shirts, ...); girar a \"roda\" e ver que brindes sabem",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 8,
          "assunto": "AgitÁgueda - Questão AJSL",
          "discussao": "- Propusemos dar 3 dias à AJSL, a começar no domingo 12 até 3ªfeira 14",
          "deliberacao": "resturantes: Convívio; Nelita; Zé Lopes (frangos); Quim; Glória; Zé Manel?; Artur (bacalhau espiritual); o que sai sempre: rojões; pica-paus; moelas; bacalhau com natas",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 10,
            "contra": 0,
            "abstencao": 0
          }
        }
      ],
      "estado": "Rascunho",
      "observacoes": "Ata importada do Excel (folha 0603).",
      "assinaturas": [
        {
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "estado": "Pendente",
          "data": ""
        },
        {
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "estado": "Pendente",
          "data": ""
        }
      ],
      "anexos": []
    },
    {
      "id": 5,
      "numero": 5,
      "referencia": "005/0526",
      "tipo": "Reunião de Direção",
      "data": "2026-05-20",
      "horaInicio": "21:00",
      "horaFim": "",
      "local": "Pavilhão Carlos Almeida, Aguada de Baixo",
      "presidiu": "Jorge Manuel da Silva Cunha",
      "secretariou": "Raquel Alexandra Marques da Cunha",
      "presencas": [
        {
          "id": 1,
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "tipo": "membro"
        },
        {
          "id": 2,
          "nome": "Artur Jorge Ferreira Cardoso",
          "cargo": "Tesoureiro",
          "tipo": "membro"
        },
        {
          "id": 3,
          "nome": "José Manuel Carreira dos Reis",
          "cargo": "Vice-Presidente",
          "tipo": "membro"
        },
        {
          "id": 5,
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "tipo": "membro"
        },
        {
          "id": 6,
          "nome": "Danilo Alexandre Estima Saraiva",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 7,
          "nome": "Agostinho Rui Ferreira Martins",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 8,
          "nome": "Ana Catarina Rua Marques",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 10,
          "nome": "Rui Miguel Baptista Abrantes",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 11,
          "nome": "Sérgio Tiago Rodrigues Novo",
          "cargo": "Vogal",
          "tipo": "membro"
        }
      ],
      "outrasPresencas": "",
      "pontos": [
        {
          "numero": 1,
          "assunto": "Logistica e organização dos Jogos de Futsal",
          "discussao": "Jogo · CASA · Sabado · 23/05/2026 · 16:00 · Masculinos · Vila Nova Mosarros\nJogo · CASA · Sabado · 23/05/2026 · 21:00 · Femininos · G.D.C.R. Miro",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 2,
          "assunto": "Resultado Sorteio AgitÁgueda",
          "discussao": "Fomos sorteados para o AgitAgueda\nsegunda semana, do 12 ao 18 (semana de 7dias) e fazemos grupo com o CENSi e a Cerciag\nBarraca 7\n- Começar a procurar voluntarios e comida\n- Questão de darmos 3 dias à AJSL, que este ano nem conseguiu se inscrever",
          "deliberacao": "Unânime desição em partilhar barraca com AJSL, pondera-se dar os dias 12, 13 e 14 (dom a terça) ou aguardar por cartaz da festa. Necessário começar a procurar mão de obra e doações (leitões, galos, etc etc)",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 3,
          "assunto": "Balanço Prova de BTT do dia 2/05",
          "discussao": "Fizemos total bruto no Bar = 1108,65€\n- devolvemos à BiciArca venda sopa (37,50) e febras (295,00) = 332,50€\n- A nossa oferta da bebida pela inscrição da prova custou-nos aprox. 70,97€\n- Barris/gás/copos pagamos = 339,30 + despesa bar 84,11€\n- sem contar despesas de drogaria/agua/luz/gás..\n- Lucro final para a ARCA = 352,74€\n- Lucro final (??) para a Biciarca = 358,89€",
          "deliberacao": "Sem decisão.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 4,
          "assunto": "Balanço Peregrinos",
          "discussao": "Fizemos total limpos estadia peregrinos = 1520,00€\nNo dia em que abrimos o bar aos peregrinos fizemos (brutos) = 297,00€",
          "deliberacao": "Pondera-se, para o ano, abrir bar durante a semana para aproveitar os peregrinos (tipo, 18h-22h)",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 5,
          "assunto": "Venda das Tabelas e Projetores velhos - Obra c/dinheiro",
          "discussao": "- Foram vendidos as tabelas de basket e os velhos projetores de iluminação,\n- Da transação realizou-se 600€ - que o comprador pediu para converter em recibo de donativos (4 recibos)\n- Inicialmente, na anterior direção, tinhamos estipulado investir numa zona de reforço muscular, mas seria tambem a oportunidade de restaurarmos e alterarmos as bancadas.\n- Eliminar parte ou totalidade das cadeiras e pormos estrado de madeira no lugar, pintarmos a bancada, tarja, etc...\n\n- Podemos tambem numa primeira fase, utilizar este fundo para a compras das camisolas e prenda de fim de época para os atletas",
          "deliberacao": "Proibido por lei recibos de donativo acima de 190€. Irá pedir-se orçamentos para pintura e reformulação das bancadas. Contudo, com os equipamentos que já temos, procurar fazer-se o espaço da musculação (limpar e juntar-se os equipamentos).",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 6,
          "assunto": "Aluguer sala por 15 meses",
          "discussao": "Fomos contactados por uma empresa de formações e queria uma proposta nosa para alugarmos a nossa sala com mesas, 15 cadeiras e acesso WC.\n- o periodo erá de 6h diarias (periodo manhã ou tarde, prefiro manhã), 5 dias por semana e durante cerca de 15 meses\n- o Publico alvo é a comunidade Cigana\n- Propusemos o mesmo preço hora que fiz da ultima vez que aluguei a sala:\n     10€/h x 6h/d = 60€/dia x aprox 20dias/mês = 1200€/mês x 15 meses = 18000€\n     estavamos abertos a justar valor ou proposições.\n\nA resposta foi negativa, porque queriam alugar a sala por 11€/DIA, 250€ por mês!\n- Teriamos muita limpeza, consumos e risco elevado de vandalismo",
          "deliberacao": "Sem decisões.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 7,
          "assunto": "Dia da Freguesia, 6 e 7 de Junho",
          "discussao": "Aproxima-se a data\n- Necessitamos de pessoas, quem pode?\nSABADO\n- quem pode ajudar o CENSI/APAB com a caminhada (logistica/pontos de passagem) na caminhada que começa às 9:30?\n- nos anos anteriores, não temos servido almoço, ficou sempre para as outras associações, querem servir almoço? Se sim a ideia será juntarmo-nos ao Censi/Apab e termos rojões (que dividimos os custos/lucros) o resto é por nossa caonta, petiscos, bebidas, cafés...\n- Jantar será a mesma ideia dos rojões com as outras 2 associações, mas será grelhados (churrasqueira), mandamos fazer uma panela de sopa a contar com os atletas (pós jogo) e vender + petiscos.\nDOMINGO\n- abrimos o bar, petiscos, durante o passeio das motos/carros, o almoço é oferecido pela junta, mas temos ser nós e as outras associações a servir.\nPessoas disponiveis, postos horários",
          "deliberacao": "Disponibilidades: Zé Reis, Sérgio, Raquel, Artur (mas pertence à associação de pais), Ana Rua (pode dia 6), Agostinho. Femininas jogam no dia 07, em casa (tentar mudar-se o jogo para sexta). Em princípio os rapazes também jogarão dia 06, se passarem para a final.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 8,
          "assunto": "Enceramento Época de Futsal - Dia 7 do DF",
          "discussao": "O almoço é oferecido pela JF, mas podemos acrescentar mais alguma coisa, champanhe, bebidas, sobremesas à nossa mesa\n- O que fazemos como oferta ou cerimonia?",
          "deliberacao": "Vender a camisola dos 40 anos em pré-venda, com possibilidade de personalizar. Pensar fazer-se uma t-shirt para oferta aos jogadores.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 9,
          "assunto": "IX Gala anual da AFA",
          "discussao": "Convite da AFA para a IX Gala anual no próximodia 12 de junho de 2026 (sexta-feira), pelas 20h30 no Cineteatro Alba, em Albergaria-a-Velha.\n- Quem pode representar a ARCA\n- Não sabemos se algum/a atleta será nomeada",
          "deliberacao": "é importante mostrar a nossa presença; disponibilidades: Ana Rua",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 10,
          "assunto": "Cicloturismo, domingo 14 de junho",
          "discussao": "Aproxima-se a data",
          "deliberacao": "Pensar fazer-se a banana (mochila à cintura), vai pedir-se orçamento à empresa Sweetborder. Zé Reis indisponível; Pessoal para inscrições e lembranças; desviar o trânsito; pensar em trajeto apenas no concelho de Águeda (+/- 18km); bar; comida (arroz de feijão e churrasco); o ano passado fez-se no parque campismo. Necessário tirar licença",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 11,
          "assunto": "ARCA Cup, sabado 20 de junho",
          "discussao": "Aproxima-se a data",
          "deliberacao": "Preciso ver árbitros; ver taças para torneio (melhor GR; melhor marcador; 1º lugar, 2º; taça do bar)",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 12,
          "assunto": "Para efeitos de renovação EUP",
          "discussao": "Alguem lembra-se de data marcantes na vida da Arca após a atribuição do EUP de 2010?\n- Tipo condecorações, taças, galas, etc...",
          "deliberacao": "Prémios individiuais das femininas pela AFA (Daniela Estima; Joana Teixeira) ; organização de interfreguesias; INATEL; representação em galas; formação até Covid-19;",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 13,
          "assunto": "Saldos Arca até à Data",
          "discussao": "Assunto apresentado à direção.",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 14,
          "assunto": "Outros",
          "discussao": "- Agostinho passou para sócio 424\n- Assuntos depois a falar: sócios, cartões sócios, site....\n- Reunião Coimbra APA Hidrica",
          "deliberacao": "Dia 22/05, o Jorge, Tiago Ramalho e a Eng.ª Rute (CivilAg) reunem com a APA; tem havido entraves para legalização do pavilhão (não há interesse em avançar com o projeto \"espelho água\" que foi proprosta pela Câmara); sempre que há reuniões na CMA nunca há atas escritas; importante haver provas documentais",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        }
      ],
      "estado": "Rascunho",
      "observacoes": "Ata importada do Excel (folha 0520).",
      "assinaturas": [
        {
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "estado": "Pendente",
          "data": ""
        },
        {
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "estado": "Pendente",
          "data": ""
        }
      ],
      "anexos": []
    },
    {
      "id": 4,
      "numero": 4,
      "referencia": "004/0426",
      "tipo": "Reunião de Direção",
      "data": "2026-04-29",
      "horaInicio": "21:00",
      "horaFim": "",
      "local": "Pavilhão Carlos Almeida, Aguada de Baixo",
      "presidiu": "Jorge Manuel da Silva Cunha",
      "secretariou": "Raquel Alexandra Marques da Cunha",
      "presencas": [
        {
          "id": 1,
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "tipo": "membro"
        },
        {
          "id": 2,
          "nome": "Artur Jorge Ferreira Cardoso",
          "cargo": "Tesoureiro",
          "tipo": "membro"
        },
        {
          "id": 3,
          "nome": "José Manuel Carreira dos Reis",
          "cargo": "Vice-Presidente",
          "tipo": "membro"
        },
        {
          "id": 4,
          "nome": "Luis Carlos Antunes dos Santos",
          "cargo": "Vice-Presidente",
          "tipo": "membro"
        },
        {
          "id": 5,
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "tipo": "membro"
        },
        {
          "id": 6,
          "nome": "Danilo Alexandre Estima Saraiva",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 7,
          "nome": "Agostinho Rui Ferreira Martins",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 8,
          "nome": "Ana Catarina Rua Marques",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 9,
          "nome": "Gabriel Antunes das Neves Carlos",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 10,
          "nome": "Rui Miguel Baptista Abrantes",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 12,
          "nome": "Verónica Baptista Abrantes",
          "cargo": "Vogal",
          "tipo": "membro"
        }
      ],
      "outrasPresencas": "",
      "pontos": [
        {
          "numero": 1,
          "assunto": "Logistica e organização dos Jogos de Futsal",
          "discussao": "Jogo · CASA · 5ªFeira · 30/04/2026 · 21:30 · Masculinos · CAP Alquerubim\nPCS: Rui Abrantes · PCS Aux. · Ana Henriques · Jorge Santos\nBar: Kika Abrantes · Cristiana Marques\nBilheteira: Soraia Martins\nJogo · FORA · Domingo · 03/05/2026 · 18:00 · Femininos · Casa Povo Miranda Corvo",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 2,
          "assunto": "Reunião com Zé Manel e o seu grupo",
          "discussao": "O Zé Manel mais um grupo (Sr. Fernando Alves), querem reunir para organizar um evento comemorativo dos veteranos que passaram pela Arca, apontando para uma reunião na quarta-feira dia 29, às 21:00",
          "deliberacao": "Convívio atletas andebol ARCA (masc e femin). Pensado fazer jogo-convívio para atletas (vai depender da adesão dos antigos jogadores). Almoço-convívio: campismo ou lateral do pavilhão. Propostas de datas: 13/junho; 04, 11 ou 18/julho. Aponta-se para dia 04/07.  (último convívio de andebol juntou cerca de 40 pessoas). Vai haver inscrição, valor de inscrição €€, lembrança. Vai publicitar-se na página da ARCA.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 3,
          "assunto": "Preparação comidas Equipas",
          "discussao": "Mudaram alguma coisa com a organização e preparação das comidas das equipas?\n- Pedidos de desculpa ou comunicados em nome da Direção têm de ser de meu conhecimento e dos restantes membros da direção",
          "deliberacao": "comidas fica à responsabilidade dos jogadores.. A ARCA fica responsável pelos custos das mesmas.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 4,
          "assunto": "(sem título)",
          "discussao": "treinador feminino próxima época",
          "deliberacao": "Ana, Zé Reis e Luís reuniram com o Diogo a 28/abril para treinar as femininas. Está disposto aceitar, nas seguintes condições: bonificação 200,00€/ mês; pediu espaço e tempo para treinar guarda-redes (implica com o Treino Funcional); acesso à Taça de Portugal. O valor tabelado é 150,00€. Diogo está mais capacitado e disponível que o Vasco. Pondera-se aumentar 25,00€ a cada treinador (total: 175,00€). Nacionais é impossível enquanto não tivermos legalização do pavilhão.Próximas multas serão majoradas porque somos reincidentes (2K). Taça de Portugal: caso as femininas assumam a responsabilidade e compromisso de arranjarem o valor da multa cerca de 3.000€ (através de rifas, etc.) é possível avançar-se",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 5,
          "assunto": "Preparativos da Direção da ARCA para a Prova de BTT do dia 2/05 (CONTINUAÇÃO)",
          "discussao": "Preparação da parte da Direção da ARCA para a Prova de BTT do dia 2/05\nNo dia 25/04 alinhavar-se limpeza à volta do pavilhão para evento Resistência, pelas 09h (disponibilidades: Sérgio Novo, Agostinho, Raquel, Gabriel.) - Este trabalho foi feito pela Junta Freguresia. No sábado, dia 02 de maio, o encontro está marcado para as 09h00. A churrasqueira ficará a cargo de João Pais, Hilário e Agostinho, enquanto a máquina de pressão será disponibilizada por Danilo, Kika e Tá.\nRelativamente à organização do evento, o bar e a bilheteira são da responsabilidade da ARCA. As receitas do bar revertem para a ARCA, sendo oferecidos 170 finos, enquanto as bifanas e a sopa revertem para a BiciArca. A distribuição de comida estará a cargo da equipa do Tá (treino funcional e zumba), que será responsável pela preparação das sandes, servir a sopa, limpar mesas, entre outras tarefas. O Cristiano ficará responsável pelo som, e a equipa do Tá assegurará também a distribuição dos kits e medalhas. As senhas distribuídas após o fim da prova.\nO Tá quer fazer abastecimento no parque de campismo que incluirá laranjas, bananas, gomas, marmelada e águas. O registo do evento, através de drone, fotografia e vídeo ao longo do dia, ficará a cargo de Zé Reis e Danilo, contando ainda com três fotógrafos confirmados pelo Tá. Está prevista a ocupação de metade do campo com alcatifa. Existem 170 pessoas inscritas, embora apenas haja mesas para 70.\nO preçário, definido pela ARCA, estabelece os seguintes valores: bifana a 2,50€, sopa a 1,50€ e fino a 1,00€. A Incycles ofereceu packs que serão entregues aos participantes do pódio.",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 6,
          "assunto": "Organizar a distribuição das tarefas das direção - CONTINUAÇÃO",
          "discussao": "Organizar a distribuição das tarefas das direção\n- Gestão das secções, relação com as federações, manutenção pavilhão e veiculo, etc",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        }
      ],
      "estado": "Rascunho",
      "observacoes": "Ata importada do Excel (folha 0429).",
      "assinaturas": [
        {
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "estado": "Pendente",
          "data": ""
        },
        {
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "estado": "Pendente",
          "data": ""
        }
      ],
      "anexos": []
    },
    {
      "id": 3,
      "numero": 3,
      "referencia": "003/0426",
      "tipo": "Reunião de Direção",
      "data": "2026-04-22",
      "horaInicio": "21:15",
      "horaFim": "",
      "local": "Pavilhão Carlos Almeida, Aguada de Baixo",
      "presidiu": "Jorge Manuel da Silva Cunha",
      "secretariou": "Raquel Alexandra Marques da Cunha",
      "presencas": [
        {
          "id": 1,
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "tipo": "membro"
        },
        {
          "id": 3,
          "nome": "José Manuel Carreira dos Reis",
          "cargo": "Vice-Presidente",
          "tipo": "membro"
        },
        {
          "id": 4,
          "nome": "Luis Carlos Antunes dos Santos",
          "cargo": "Vice-Presidente",
          "tipo": "membro"
        },
        {
          "id": 6,
          "nome": "Danilo Alexandre Estima Saraiva",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 7,
          "nome": "Agostinho Rui Ferreira Martins",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 8,
          "nome": "Ana Catarina Rua Marques",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 10,
          "nome": "Rui Miguel Baptista Abrantes",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 11,
          "nome": "Sérgio Tiago Rodrigues Novo",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 12,
          "nome": "Verónica Baptista Abrantes",
          "cargo": "Vogal",
          "tipo": "membro"
        }
      ],
      "outrasPresencas": "",
      "pontos": [
        {
          "numero": 1,
          "assunto": "Logistica e organização dos Jogos de Futsal",
          "discussao": "Jogo · CASA · 6ªFeira · 24/04/2026 · 21:30 · Femininos · C.F.Santa Clara\nPCS: Jorge Cunha · PCS Aux. · Rui Abrantes · Catarina Liberal\nBar: Sérgio Novo\nBilheteira: Agostinho Martins\nJogo · FORA · Domingo · 26/04/2026 · 17:00 · Masculinos · Sc. S.João Ver",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 2,
          "assunto": "Organizar a distribuição das tarefas das direção - CONTINUAÇÃO",
          "discussao": "Organizar a distribuição das tarefas das direção\n- Gestão das secções, relação com as federações, manutenção pavilhão e veiculo, etc",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 3,
          "assunto": "Limpeza pavilhão sexta-feira dia 24",
          "discussao": "Devido as obras de iluminação, haverá necessidade de se efetuar a limpeza do piso antes do jogo das 21:30",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 4,
          "assunto": "Reunião com Zé Manel e o seu grupo",
          "discussao": "O Zé Manel mais um grupo, querem reunir para organizar um evento comemorativo dos veteranos que passaram pela Arca, apontando para uma reunião na quarta-feira dia 29, às 21:00",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 5,
          "assunto": "Entrega de chaves",
          "discussao": "Entrega de cheves a cada elemento e explicação de alguns detalhes",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 9,
            "contra": 0,
            "abstencao": 0
          }
        }
      ],
      "estado": "Rascunho",
      "observacoes": "Ata importada do Excel (folha 0422).",
      "assinaturas": [
        {
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "estado": "Pendente",
          "data": ""
        },
        {
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "estado": "Pendente",
          "data": ""
        }
      ],
      "anexos": []
    },
    {
      "id": 2,
      "numero": 2,
      "referencia": "002/0426",
      "tipo": "Reunião de Direção",
      "data": "2026-04-15",
      "horaInicio": "21:15",
      "horaFim": "",
      "local": "Pavilhão Carlos Almeida, Aguada de Baixo",
      "presidiu": "Jorge Manuel da Silva Cunha",
      "secretariou": "Raquel Alexandra Marques da Cunha",
      "presencas": [
        {
          "id": 1,
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "tipo": "membro"
        },
        {
          "id": 5,
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "tipo": "membro"
        },
        {
          "id": 6,
          "nome": "Danilo Alexandre Estima Saraiva",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 7,
          "nome": "Agostinho Rui Ferreira Martins",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 9,
          "nome": "Gabriel Antunes das Neves Carlos",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 12,
          "nome": "Verónica Baptista Abrantes",
          "cargo": "Vogal",
          "tipo": "membro"
        }
      ],
      "outrasPresencas": "",
      "pontos": [
        {
          "numero": 1,
          "assunto": "Logistica e organização dos Jogos de Futsal",
          "discussao": "Jogo · CASA · Sabado · 18/04/2026 · 18:00 · Masculinos · AD Casal\nPCS: Danilo · PCS Aux. · Ana Reis · Jorge Cunha\nBar: Sérgio Novo · Gabriel Carlos\nBilheteira: Verónica Abrantes\nJogo · FORA · Domingo · 19/04/2026 · 17:00 · Femininos · Grupo S.S.D.C.R. de Miro",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 6,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 2,
          "assunto": "Preparativos da Direção da ARCA para a Prova de BTT do dia 2/05 (CONTINUAÇÃO)",
          "discussao": "Preparação da parte da Direção da ARCA para a Prova de BTT do dia 2/05",
          "deliberacao": "No dia 25/04 alinhavar-se limpeza à volta do pavilhão para evento Resistência, pelas 09h (disponibilidades: Sérgio Novo, Agostinho, Raquel, Gabriel....)",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 6,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 3,
          "assunto": "Procurar alternativas para os VND para os dia 30/04 e 07/05",
          "discussao": "- Será impossivel os alugueres com os Valha-Nos-Deus das quintas-feiras 30/04 e 07/05 e foi nos pedido uma alternativa:\nPara a quinta dia 30, podemos talvez trocar para quarta dia 29.\nPara a quinta dia 7 de maio, talvez possamos trocar para quarta dia 6.\n- Às quartas-feiras o pavilhão está desocupado, mas como vai haver mudança com os dias seguintes, temos de ver se as equipas não necessitam desses dias para poder propor essas alternatias aos VND",
          "deliberacao": "30/04 ocupado com jogo do futsal masculino; 07/maio ocupado com peregrinos. Há quarta não há agenda. Femininos e VND treinam quarta, dia 29/04 (masculinos só treinam 1x essa semana). Femininos, masculinos e VND treinam quarta, 06/05",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 6,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 4,
          "assunto": "Acertar algumas datas de eventos com o Plano de actividades para 2026",
          "discussao": "Discussão do Plano de actividades para 2026\n- Organizar datas e viabilidade para realização dos eventos\n- Ver disponibilidades",
          "deliberacao": "Alteração de data de eventos do Plano de Atividades. Noite das sopas estima-se realizar a 03/outubro (agilizar animação, sugeriu-se jogos tradicionais). Torneio Arca CUP realizar-se-á a 20/junho. Taça Jorginho realizar-se-á em julho (consoante sorteio da Arca no agitagueda).",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 6,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 5,
          "assunto": "Disponibilidade na participação nas celebrações do 25 de Avril da CM Agueda",
          "discussao": "- Sondar quem pode participar\n- De que forma podemos participar: vestimente, bandeira ou cartaz ou faxa.\n- Antes e depois",
          "deliberacao": "Disponibilidade (Verónica, Sérgio, Raquel, Jorge, ...). Irá fazer-se uma tarja (litogrou; litoprint; facting). Todos vestirem t-shirt verde ARCA.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 6,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 6,
          "assunto": "Comunicações",
          "discussao": "Comunicações gerais:\n- Ponto de situação financeira\n- Informação com a nova iluminação\n- Recebimentos apoios CM Agueda após candidatura e e acerto do ano passado.\n- Assim que tivermos as atas (direção e tomada de posse completa) vamos poder fazer:\n   - atualizar os titulares no Banco\n   - trabalhar na renovação do estatuto de Utilidade Publica\n   - etc.",
          "deliberacao": "Ponto de situação financeiro dado 1x por mês. (janeiro +, fevereiro e março -, abril +, recebemos valor da CMA). Estima-se gastar cerca de 3.000,00€ com alteração da iluminação.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 6,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 7,
          "assunto": "Organizar a distribuição das tarefas das direção - CONTINUAÇÃO",
          "discussao": "Organizar a distribuição das tarefas das direção\n- Gestão das secções, relação com as federações, manutenção pavilhão e veiculo, etc",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 6,
            "contra": 0,
            "abstencao": 0
          }
        }
      ],
      "estado": "Rascunho",
      "observacoes": "Ata importada do Excel (folha 0415).",
      "assinaturas": [
        {
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "estado": "Pendente",
          "data": ""
        },
        {
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "estado": "Pendente",
          "data": ""
        }
      ],
      "anexos": []
    },
    {
      "id": 1,
      "numero": 1,
      "referencia": "001/0426",
      "tipo": "Reunião de Direção",
      "data": "2026-04-08",
      "horaInicio": "21:15",
      "horaFim": "",
      "local": "Pavilhão Carlos Almeida, Aguada de Baixo",
      "presidiu": "Jorge Manuel da Silva Cunha",
      "secretariou": "Raquel Alexandra Marques da Cunha",
      "presencas": [
        {
          "id": 1,
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "tipo": "membro"
        },
        {
          "id": 2,
          "nome": "Artur Jorge Ferreira Cardoso",
          "cargo": "Tesoureiro",
          "tipo": "membro"
        },
        {
          "id": 3,
          "nome": "José Manuel Carreira dos Reis",
          "cargo": "Vice-Presidente",
          "tipo": "membro"
        },
        {
          "id": 4,
          "nome": "Luis Carlos Antunes dos Santos",
          "cargo": "Vice-Presidente",
          "tipo": "membro"
        },
        {
          "id": 5,
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "tipo": "membro"
        },
        {
          "id": 6,
          "nome": "Danilo Alexandre Estima Saraiva",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 7,
          "nome": "Agostinho Rui Ferreira Martins",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 8,
          "nome": "Ana Catarina Rua Marques",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 10,
          "nome": "Rui Miguel Baptista Abrantes",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 11,
          "nome": "Sérgio Tiago Rodrigues Novo",
          "cargo": "Vogal",
          "tipo": "membro"
        },
        {
          "id": 12,
          "nome": "Verónica Baptista Abrantes",
          "cargo": "Vogal",
          "tipo": "membro"
        }
      ],
      "outrasPresencas": "",
      "pontos": [
        {
          "numero": 1,
          "assunto": "Logistica e organização dos Jogos de Futsal",
          "discussao": "Jogo · FORA · Sabado · 11/04/2026 · 18:00 · Masculinos · CAP Alquerubim\nJogo · CASA · Sabado · 11/04/2026 · 21:00 · Femininos · A.D. Couto Mineiro Pejão\nPCS: Jorge Cunha · PCS Aux. · Ana Reis · Jorge Santos\nBar: Artur Jorge F. Cardoso · Sérgio Novo · Bilheteira · Raquel Cunha",
          "deliberacao": "Sem deliberação formal registada nesta data.",
          "votacao": {
            "tipo": "Tomada de Conhecimento",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 2,
          "assunto": "Prova de BTT BiciArca Team/CM Agueda",
          "discussao": "Participação da Direção no Evento \"Prova de BTT BiciArca Team/CM Agueda\" do dia 2 de maio.\n- Organização das nossas tarefas, bar, bilheteira, comida\n- Ajuda extra à direção, João Pais, Hilario, etc.",
          "deliberacao": "Serão precisas cerca de 15/20 pessoas para organização. Bar (3); Bilheteira (2); Caixa (2); Preparação comida (2); Churrasqueira (2/3) Máquina de pressão para limpeza bicicletas (1/2); Balneários (1). Animação encarregue BiciArca. Análise sobre ter máquina finos no campismo. Preçário: finos a 1,20€; metro a 10€. Jorge fica de mandar vir 4 barris de 50L, consoante agilização da máquina de finos.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 3,
          "assunto": "Discussão do Plano de actividades para 2026",
          "discussao": "Discussão do Plano de actividades para 2026\n- Organizar datas e viabilidade para realização dos eventos\n- Ver disponibilidades",
          "deliberacao": "Alteração de data de eventos do Plano de Atividades. Noite das sopas estima-se realizar a 03/outubro (agilizar animação, sugeriu-se jogos tradicionais). Torneio Arca CUP realizar-se-á a 20/junho. Taça Jorginho realizar-se-á em julho (consoante sorteio da Arca no agitagueda).",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 4,
          "assunto": "Organizar a distribuição das tarefas das direção",
          "discussao": "Organizar a distribuição das tarefas das direção\n- Gestão das secções, relação com as federações, manutenção pavilhão e veiculo, etc",
          "deliberacao": "Discutir-se-á em próximas reuniões.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        },
        {
          "numero": 5,
          "assunto": "Instalação da nova iluminação do pavilhão",
          "discussao": "Instalação da nova iluminação do pavilhão.\n- Carregar campanulas no fornecedor na Malaposta e descargar na Arca\n- Carregar armaduras na Climar e descargar na Arca\n- Carregar placas de madeira em Oiã onde trabalha Sergio Novo e descargar na Arca",
          "deliberacao": "Responsabilizou-se de tratar: Artur, Jorge e Sérgio Novo. O Miko empresta carrinha.",
          "votacao": {
            "tipo": "Unanimidade",
            "aFavor": 11,
            "contra": 0,
            "abstencao": 0
          }
        }
      ],
      "estado": "Rascunho",
      "observacoes": "Ata importada do Excel (folha 0408).",
      "assinaturas": [
        {
          "nome": "Jorge Manuel da Silva Cunha",
          "cargo": "Presidente",
          "estado": "Pendente",
          "data": ""
        },
        {
          "nome": "Raquel Alexandra Marques da Cunha",
          "cargo": "Secretária",
          "estado": "Pendente",
          "data": ""
        }
      ],
      "anexos": []
    }
  ];

  // Expor seed para Firebase Sync e inicializações
  window.getArcaAtasSeed = function() {
    return JSON.parse(JSON.stringify(SEED_ATAS));
  };

  // Obter Atas com garantia de persistência local
  window.getArcaAtas = function() {
    try {
      const local = localStorage.getItem(ATAS_STORAGE_KEY);
      if (local) {
        let parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let deletedIds = [];
          try {
            deletedIds = JSON.parse(localStorage.getItem('arca_deleted_ata_ids') || '[]');
          } catch(e) {}
          if (deletedIds.length > 0) {
            parsed = parsed.filter(a => !deletedIds.includes(Number(a.id)));
          }
          let added = false;
          SEED_ATAS.forEach(seed => {
            if (!deletedIds.includes(Number(seed.id)) && !parsed.some(p => Number(p.id) === Number(seed.id) || (p.referencia && p.referencia === seed.referencia))) {
              parsed.push(seed);
              added = true;
            }
          });
          parsed.sort((a, b) => (Number(b.numero || b.id || 0) - Number(a.numero || a.id || 0)));
          if (added) {
            try { localStorage.setItem(ATAS_STORAGE_KEY, JSON.stringify(parsed)); } catch(e){}
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[ARCA Atas] Erro ao ler atas do localStorage:', e);
    }

    // Fallback: usar o seed oficial
    let deletedIds = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('arca_deleted_ata_ids') || '[]');
    } catch(e) {}
    const initial = SEED_ATAS.filter(a => !deletedIds.includes(Number(a.id)));
    try {
      localStorage.setItem(ATAS_STORAGE_KEY, JSON.stringify(initial));
    } catch(e) {}
    return initial;
  };

  window.saveArcaAtasLocal = function(list) {
    try {
      localStorage.setItem(ATAS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('[ARCA Atas] Erro ao gravar atas no localStorage:', e);
    }
  };

})();
