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
