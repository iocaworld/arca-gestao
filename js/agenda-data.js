/**
 * =============================================================================
 * A.R.C.A. - Associação Recreativa e Cultural de Aguada de Baixo
 * Base de Dados Inicial e Gestão de Agendas (Jogos, Eventos, Reuniões e Tarefas)
 * =============================================================================
 */

(function() {
  'use strict';

  const AGENDA_STORAGE_KEY = 'arca_gestao_agenda_v1';
  const DELETED_AGENDA_KEY = 'arca_deleted_agenda_ids';

  // Coleção inicial oficial da Gestão de Agendas da ARCA
  const SEED_AGENDA = [
    // -------------------------------------------------------------------------
    // 1. JOGOS
    // -------------------------------------------------------------------------
    {
      id: 1,
      categoria: "jogos",
      tipo: "Jogo Oficial",
      titulo: "Futsal Seniores Masc. • CAP Alquerubim vs ARCA",
      subtitulo: "Campeonato Distrital AFA • 1ª Divisão",
      data: "2026-04-11",
      horaInicio: "18:00",
      horaFim: "19:45",
      local: "Pavilhão Gimnodesportivo de Alquerubim",
      ambito: "Fora",
      seccao: "Futsal Masculino",
      escalao: "Seniores",
      adversario: "C.A.P. Alquerubim",
      responsavel: "Jorge Manuel da Silva Cunha",
      contacto: "966 100 115",
      estado: "Concluído",
      descricao: "Jogo oficial da 22ª jornada do campeonato distrital da AFA.",
      logistica: "Transporte em carrinha da associação às 16:30h com kit médico e equipamentos oficiais.",
      criadoPor: "Jorge Manuel da Silva Cunha",
      criadoEm: "2026-04-01T10:00:00Z"
    },
    {
      id: 2,
      categoria: "jogos",
      tipo: "Jogo Oficial",
      titulo: "Futsal Seniores Fem. • ARCA vs A.D. Couto Mineiro Pejão",
      subtitulo: "Campeonato Distrital Futsal Feminino",
      data: "2026-04-11",
      horaInicio: "21:00",
      horaFim: "22:45",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Casa",
      seccao: "Futsal Feminino",
      escalao: "Seniores",
      adversario: "A.D. Couto Mineiro Pejão",
      responsavel: "Raquel Alexandra Marques da Cunha",
      contacto: "912 345 678",
      estado: "Concluído",
      descricao: "Partida disputada no Pavilhão Carlos Almeida com grande afluência de sócios.",
      logistica: "PCS: Jorge Cunha · PCS Aux: Ana Reis e Jorge Santos. Serviço de bar por Artur Cardoso e Sérgio Novo. Bilheteira: Raquel Cunha.",
      criadoPor: "Raquel Alexandra Marques da Cunha",
      criadoEm: "2026-04-02T11:00:00Z"
    },
    {
      id: 3,
      categoria: "jogos",
      tipo: "Jogo Oficial",
      titulo: "Futsal Seniores Masc. • ARCA vs AD Casal",
      subtitulo: "Campeonato Distrital AFA • Pavilhão Carlos Almeida",
      data: "2026-04-18",
      horaInicio: "18:00",
      horaFim: "19:45",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Casa",
      seccao: "Futsal Masculino",
      escalao: "Seniores",
      adversario: "A.D. Casal",
      responsavel: "Danilo Alexandre Estima Saraiva",
      contacto: "918 223 344",
      estado: "Concluído",
      descricao: "Jogo em casa com receção aos dirigentes do AD Casal e apoio dos adeptos.",
      logistica: "PCS: Danilo Saraiva · PCS Aux: Ana Reis e Jorge Cunha. Bar: Sérgio Novo e Gabriel Carlos. Bilheteira: Verónica Abrantes.",
      criadoPor: "Danilo Alexandre Estima Saraiva",
      criadoEm: "2026-04-10T14:30:00Z"
    },
    {
      id: 4,
      categoria: "jogos",
      tipo: "Jogo Oficial",
      titulo: "Futsal Seniores Fem. • Grupo Miro vs ARCA",
      subtitulo: "Campeonato Distrital Futsal Feminino",
      data: "2026-04-19",
      horaInicio: "17:00",
      horaFim: "18:45",
      local: "Pavilhão Desportivo de Miro",
      ambito: "Fora",
      seccao: "Futsal Feminino",
      escalao: "Seniores",
      adversario: "Grupo S.S.D.C.R. de Miro",
      responsavel: "Ana Catarina Rua Marques",
      contacto: "919 887 766",
      estado: "Concluído",
      descricao: "Deslocação das atletas femininas a Miro para a jornada oficial.",
      logistica: "Saída do Pavilhão às 14:45h. Reforço de água e fruta fornecido pela associação.",
      criadoPor: "Ana Catarina Rua Marques",
      criadoEm: "2026-04-12T09:00:00Z"
    },
    {
      id: 5,
      categoria: "jogos",
      tipo: "Jogo Oficial",
      titulo: "Futsal Seniores Masc. • ARCA vs ADREP",
      subtitulo: "Campeonato Distrital AFA • Pavilhão Carlos Almeida",
      data: "2026-04-25",
      horaInicio: "18:00",
      horaFim: "19:45",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Casa",
      seccao: "Futsal Masculino",
      escalao: "Seniores",
      adversario: "ADREP",
      responsavel: "Artur Jorge Ferreira Cardoso",
      contacto: "963 882 110",
      estado: "Concluído",
      descricao: "Dérbi regional com bancada cheia no Pavilhão Carlos Almeida.",
      logistica: "Reforço de segurança e delegados de campo. Bar com abastecimento duplo.",
      criadoPor: "Artur Jorge Ferreira Cardoso",
      criadoEm: "2026-04-15T18:00:00Z"
    },
    {
      id: 6,
      categoria: "jogos",
      tipo: "Jogo Oficial",
      titulo: "Futsal Seniores Fem. • Lusitânia Lourosa vs ARCA",
      subtitulo: "Campeonato Distrital Futsal Feminino",
      data: "2026-04-26",
      horaInicio: "17:00",
      horaFim: "18:45",
      local: "Pavilhão do Lusitânia de Lourosa",
      ambito: "Fora",
      seccao: "Futsal Feminino",
      escalao: "Seniores",
      adversario: "Lusitânia de Lourosa",
      responsavel: "Raquel Alexandra Marques da Cunha",
      contacto: "912 345 678",
      estado: "Concluído",
      descricao: "Jornada fora com excelente exibição coletiva das atletas da ARCA.",
      logistica: "Coordenação de transporte e lanches pós-jogo com o treinador Diogo.",
      criadoPor: "Raquel Alexandra Marques da Cunha",
      criadoEm: "2026-04-18T10:00:00Z"
    },
    {
      id: 7,
      categoria: "jogos",
      tipo: "Torneio",
      titulo: "Torneio ARCA CUP 2026 • Futsal",
      subtitulo: "Torneio Aberto de Futsal Masculino e Feminino",
      data: "2026-06-20",
      horaInicio: "09:00",
      horaFim: "21:30",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Casa",
      seccao: "Futsal Geral",
      escalao: "Aberto",
      adversario: "Equipas Inscritas (12 equipas)",
      responsavel: "Danilo Alexandre Estima Saraiva",
      contacto: "918 223 344",
      estado: "Concluído",
      descricao: "Torneio anual de convívio desportivo da ARCA, com troféus para os 4 primeiros e prémios individuais.",
      logistica: "Quadro de jogos oficial, 2 árbitros convidados, serviço de churrasco e refeições durante o dia inteiro.",
      criadoPor: "Danilo Alexandre Estima Saraiva",
      criadoEm: "2026-05-10T12:00:00Z"
    },
    {
      id: 8,
      categoria: "jogos",
      tipo: "Torneio",
      titulo: "Torneio Inter-Freguesias de Futsal",
      subtitulo: "Pavilhão Carlos Almeida • Taça Amizade",
      data: "2026-06-27",
      horaInicio: "15:00",
      horaFim: "23:00",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Casa",
      seccao: "Futsal",
      escalao: "Seniores",
      adversario: "Seleções das Freguesias Vizinhas",
      responsavel: "Luis Carlos Antunes dos Santos",
      contacto: "915 443 221",
      estado: "Concluído",
      descricao: "Jogos da fase de grupos e finais no Pavilhão da ARCA com apoio dos municípios vizinhos.",
      logistica: "Pavilhão reservado, apoio médico, som e iluminação noturna garantida.",
      criadoPor: "Luis Carlos Antunes dos Santos",
      criadoEm: "2026-05-20T16:00:00Z"
    },
    {
      id: 9,
      categoria: "jogos",
      tipo: "Torneio",
      titulo: "3ª Edição Torneio ARCA Millwire • Futsal Feminino",
      subtitulo: "Competição Regional de Futsal Feminino",
      data: "2026-07-11",
      horaInicio: "09:30",
      horaFim: "20:30",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Casa",
      seccao: "Futsal Feminino",
      escalao: "Seniores",
      adversario: "Equipas da Região Centro",
      responsavel: "Ana Catarina Rua Marques",
      contacto: "919 887 766",
      estado: "Concluído",
      descricao: "Inscrições a 80€ por equipa, com prémios monetários, taças e medalhas de participação.",
      logistica: "Equipa sénior feminina a agilizar a gestão do bar e apoio aos balneários durante o evento.",
      criadoPor: "Ana Catarina Rua Marques",
      criadoEm: "2026-06-05T11:00:00Z"
    },
    {
      id: 10,
      categoria: "jogos",
      tipo: "Torneio",
      titulo: "Taça Jorginho 2026 • Futsal & Convívio",
      subtitulo: "Homenagem Anual a Jorginho",
      data: "2026-09-05",
      horaInicio: "10:00",
      horaFim: "21:00",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Casa",
      seccao: "Futsal e Veteranos",
      escalao: "Veteranos e Mistos",
      adversario: "Equipas Amigas da ARCA",
      responsavel: "Jorge Ferreira / Luis Carlos Santos",
      contacto: "966 100 115",
      estado: "Confirmado",
      descricao: "Torneio comemorativo com entrega de taça perpétua e almoço convívio para todas as equipas.",
      logistica: "Organização das escalas de pavilhão e churrasco coordenado pelo dirigente Jorge Ferreira.",
      criadoPor: "Jorge Manuel da Silva Cunha",
      criadoEm: "2026-06-25T17:00:00Z"
    },
    {
      id: 11,
      categoria: "jogos",
      tipo: "Apresentação",
      titulo: "Apresentação Oficial das Equipas ARCA 2026/27",
      subtitulo: "Futsal Masculino, Feminino e Formação",
      data: "2026-09-19",
      horaInicio: "17:00",
      horaFim: "22:00",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Casa",
      seccao: "Todas as Secções Desportivas",
      escalao: "Todos os Escalões",
      adversario: "Equipas Convidadas de Honra",
      responsavel: "Jorge Manuel da Silva Cunha",
      contacto: "966 100 115",
      estado: "Confirmado",
      descricao: "Cerimónia solene de apresentação das equipas técnicas, atletas e novos equipamentos com jogos de demonstração.",
      logistica: "Fotógrafo oficial, som e lanche convívio aberto a todos os sócios e familiares.",
      criadoPor: "Jorge Manuel da Silva Cunha",
      criadoEm: "2026-07-05T10:00:00Z"
    },

    // -------------------------------------------------------------------------
    // 2. EVENTOS
    // -------------------------------------------------------------------------
    {
      id: 12,
      categoria: "eventos",
      tipo: "Tradição",
      titulo: "Cantar das Janeiras por Aguada de Baixo",
      subtitulo: "Tradição Popular e Convívio de Reis",
      data: "2026-01-10",
      horaInicio: "20:00",
      horaFim: "23:30",
      local: "Ruas e Lugares da Freguesia",
      ambito: "Exterior",
      seccao: "Ação Cultural",
      escalao: "Geral",
      adversario: "Comunidade Local",
      responsavel: "Direção da ARCA",
      contacto: "966 100 115",
      estado: "Concluído",
      descricao: "Visita aos lares e locais da freguesia com cantares tradicionais das Janeiras e recolha de donativos para a associação.",
      logistica: "Trajes tradicionais, carrinha de apoio e lanche quente no encerramento.",
      criadoPor: "Jorge Manuel da Silva Cunha",
      criadoEm: "2026-01-02T15:00:00Z"
    },
    {
      id: 13,
      categoria: "eventos",
      tipo: "BTT / Resistência",
      titulo: "Prova BTT BiciARCA Team / CM Águeda 2026",
      subtitulo: "Prova de Resistência de BTT (3 Horas)",
      data: "2026-05-02",
      horaInicio: "08:30",
      horaFim: "18:00",
      local: "Pavilhão Carlos Almeida e Trilhos da Freguesia",
      ambito: "Exterior",
      seccao: "BiciARCA",
      escalao: "Aberto",
      adversario: "Mais de 150 atletas federados e lazer",
      responsavel: "João Pais / Jorge Cunha / Sérgio Novo",
      contacto: "966 100 115",
      estado: "Concluído",
      descricao: "Grande prova de BTT integrada no calendário regional, com secretariado e meta no Pavilhão Carlos Almeida.",
      logistica: "Cerca de 20 voluntários: bar, bilheteira, preparação de comida, churrasqueira, máquina de pressão para lavagem de bicicletas e apoio aos balneários.",
      criadoPor: "Jorge Manuel da Silva Cunha",
      criadoEm: "2026-04-05T09:00:00Z"
    },
    {
      id: 14,
      categoria: "eventos",
      tipo: "Cicloturismo",
      titulo: "Passeio de Cicloturismo / BiciARCA 2026",
      subtitulo: "Passeio Solidário e Convívio das Duas Rodas",
      data: "2026-06-14",
      horaInicio: "08:30",
      horaFim: "15:00",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Exterior",
      seccao: "BiciARCA",
      escalao: "Todas as Idades",
      adversario: "Associados e Simpatizantes",
      responsavel: "Hilário / Direção ARCA",
      contacto: "966 100 115",
      estado: "Concluído",
      descricao: "Passeio pelas vias da freguesia e concelho com almoço convívio final no pavilhão da ARCA.",
      logistica: "Batedores de segurança, carro-vassoura, reforço alimentar líquido e sólido no percurso.",
      criadoPor: "Jorge Manuel da Silva Cunha",
      criadoEm: "2026-05-12T14:00:00Z"
    },
    {
      id: 15,
      categoria: "eventos",
      tipo: "Comemoração",
      titulo: "Dia da Freguesia de Aguada de Baixo",
      subtitulo: "Banca e Participação da ARCA no Parque da Freguesia",
      data: "2026-06-21",
      horaInicio: "10:00",
      horaFim: "19:00",
      local: "Parque da Freguesia de Aguada de Baixo",
      ambito: "Exterior",
      seccao: "Direção e Voluntariado",
      escalao: "Geral",
      adversario: "Freguesia de Aguada de Baixo",
      responsavel: "Artur Jorge Cardoso / Jorge Cunha",
      contacto: "963 882 110",
      estado: "Concluído",
      descricao: "Representação institucional e exploração do bar e petiscos com receitas a reverter para a ARCA.",
      logistica: "Montagem de banca, toldo oficial ARCA, abastecimento de bebidas e venda de merchandising dos 40 anos.",
      criadoPor: "Artur Jorge Ferreira Cardoso",
      criadoEm: "2026-05-25T11:00:00Z"
    },
    {
      id: 16,
      categoria: "eventos",
      tipo: "Andebol",
      titulo: "Encontro e Convívio de Andebol ARCA",
      subtitulo: "Pavilhão Carlos Almeida • Antigos e Novos Praticantes",
      data: "2026-07-04",
      horaInicio: "14:00",
      horaFim: "20:00",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Casa",
      seccao: "Andebol",
      escalao: "Veteranos e Jovens",
      adversario: "Equipas Amigas Convidadas",
      responsavel: "José Manuel Carreira dos Reis",
      contacto: "917 554 433",
      estado: "Concluído",
      descricao: "Dia dedicado à modalidade histórica de andebol da associação com jogos e tertúlia associativa.",
      logistica: "Apoio da direção na sexta-feira anterior na preparação do pavilhão e bancada.",
      criadoPor: "José Manuel Carreira dos Reis",
      criadoEm: "2026-06-15T15:30:00Z"
    },
    {
      id: 17,
      categoria: "eventos",
      tipo: "Solidariedade",
      titulo: "Acolhimento aos Peregrinos de Fátima",
      subtitulo: "Jantar, Pernoita e Apoio aos Peregrinos",
      data: "2026-07-07",
      horaInicio: "18:00",
      horaFim: "23:00",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Casa",
      seccao: "Solidariedade Social",
      escalao: "Geral",
      adversario: "Peregrinos a caminho do Santuário",
      responsavel: "Artur Jorge Cardoso / José Reis / Luís Santos",
      contacto: "963 882 110",
      estado: "Concluído",
      descricao: "Acolhimento com jantar de carne de porco à alentejana e apoio de balneários e colchões para descanso no pavilhão.",
      logistica: "Escala voluntária de dirigentes: Zé Reis, Rui Abrantes, Luís Santos, Artur Cardoso e Jorge Cunha.",
      criadoPor: "Jorge Manuel da Silva Cunha",
      criadoEm: "2026-06-25T19:00:00Z"
    },
    {
      id: 18,
      categoria: "eventos",
      tipo: "Festival",
      titulo: "AgitÁgueda 2026 • Tasquinha Oficial da ARCA",
      subtitulo: "Presença de 3 Semanas no Recinto do AgitÁgueda",
      data: "2026-07-09",
      horaInicio: "19:00",
      horaFim: "02:00",
      local: "Recinto do AgitÁgueda, Águeda",
      ambito: "Exterior",
      seccao: "Direção e Voluntários ARCA",
      escalao: "Todos os Sócios",
      adversario: "Público do AgitÁgueda",
      responsavel: "Luis Carlos Antunes dos Santos",
      contacto: "915 443 221",
      estado: "Concluído",
      descricao: "A maior operação anual de angariação de fundos da ARCA, com petiscos, sangria e serviço de jantar em turnos.",
      logistica: "Escalas diárias de voluntários organizadas por Luís Santos. Material transportado em parceria com Cerciag.",
      criadoPor: "Luis Carlos Antunes dos Santos",
      criadoEm: "2026-06-28T16:00:00Z"
    },
    {
      id: 19,
      categoria: "eventos",
      tipo: "Juventude / Convívio",
      titulo: "Rota das Minis de Aguada de Baixo 2026",
      subtitulo: "Percurso pelos Estabelecimentos da Freguesia",
      data: "2026-09-05",
      horaInicio: "14:30",
      horaFim: "20:00",
      local: "Freguesia de Aguada de Baixo",
      ambito: "Exterior",
      seccao: "Juventude ARCA",
      escalao: "Maiores de 18 Anos",
      adversario: "Participantes Inscritos",
      responsavel: "Sérgio Tiago Rodrigues Novo",
      contacto: "916 332 211",
      estado: "Confirmado",
      descricao: "Percurso pedestre e de convívio pelos cafés aderentes da freguesia com t-shirt e pulseira oficial.",
      logistica: "Acordo com cafés parceiros, pulseiras numeradas e chegada ao Pavilhão com música.",
      criadoPor: "Sérgio Tiago Rodrigues Novo",
      criadoEm: "2026-07-01T14:00:00Z"
    },
    {
      id: 20,
      categoria: "eventos",
      tipo: "Gastronomia",
      titulo: "Noite das Sopas Tradicionais da ARCA",
      subtitulo: "Festival Gastronómico e Jogos Tradicionais",
      data: "2026-10-03",
      horaInicio: "19:30",
      horaFim: "23:30",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Casa",
      seccao: "Cultura e Gastronomia",
      escalao: "Todas as Famílias",
      adversario: "Comunidade e Sócios",
      responsavel: "Raquel Alexandra Marques da Cunha",
      contacto: "912 345 678",
      estado: "Confirmado",
      descricao: "Degustação de mais de 10 variedades de sopas tradicionais preparadas por associados, com tigela comemorativa de oferta.",
      logistica: "Venda prévia de bilhetes, montagem de mesas no pavilhão, animação musical e torneio de jogos tradicionais.",
      criadoPor: "Raquel Alexandra Marques da Cunha",
      criadoEm: "2026-04-15T20:00:00Z"
    },
    {
      id: 21,
      categoria: "eventos",
      tipo: "Comemoração",
      titulo: "40º Aniversário da Fundação da ARCA (1986 - 2026)",
      subtitulo: "Sessão Solene, Homenagens e Bolo de Aniversário",
      data: "2026-11-15",
      horaInicio: "16:00",
      horaFim: "22:00",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Casa",
      seccao: "Órgãos Sociais da ARCA",
      escalao: "Todos os Associados",
      adversario: "Convidados Institucionais e Comunidade",
      responsavel: "Jorge Manuel da Silva Cunha",
      contacto: "966 100 115",
      estado: "Confirmado",
      descricao: "Comemoração dos 40 anos de história da ARCA ao serviço da cultura, desporto e recreio de Aguada de Baixo.",
      logistica: "Distribuição dos polos e crachás comemorativos aos sócios, exposição fotográfica histórica e porto de honra.",
      criadoPor: "Jorge Manuel da Silva Cunha",
      criadoEm: "2026-05-02T18:00:00Z"
    },
    {
      id: 22,
      categoria: "eventos",
      tipo: "Natal",
      titulo: "Jantar de Natal e Homenagem aos Sócios Fundadores",
      subtitulo: "Encerramento do Ano Comemorativo dos 40 Anos",
      data: "2026-12-19",
      horaInicio: "20:00",
      horaFim: "23:59",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Casa",
      seccao: "Direção da ARCA",
      escalao: "Famílias Associadas",
      adversario: "Associados e Simpatizantes",
      responsavel: "Artur Jorge Ferreira Cardoso",
      contacto: "963 882 110",
      estado: "Em Planeamento",
      descricao: "Grande ceia de Natal associativa com entrega de lembranças aos sócios com 25 e 40 anos de filiação ininterrupta.",
      logistica: "Reserva de catering, aquecimento especial do pavilhão, árvore de natal e lembranças de mérito associativo.",
      criadoPor: "Artur Jorge Ferreira Cardoso",
      criadoEm: "2026-07-01T12:00:00Z"
    },

    // -------------------------------------------------------------------------
    // 3. REUNIÕES
    // -------------------------------------------------------------------------
    {
      id: 23,
      categoria: "reunioes",
      tipo: "Reunião de Direção",
      titulo: "Reunião Ordinária de Direção • Ata 001/0426",
      subtitulo: "Pavilhão Carlos Almeida • Sala de Direção",
      data: "2026-04-08",
      horaInicio: "21:15",
      horaFim: "23:30",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Interno",
      seccao: "Direção",
      escalao: "Dirigentes",
      adversario: "Membros da Direção",
      responsavel: "Jorge Manuel da Silva Cunha",
      contacto: "966 100 115",
      estado: "Concluído",
      descricao: "Análise da logística de futsal, prova de BTT BiciARCA, plano de atividades e nova iluminação do pavilhão.",
      logistica: "Convocatória enviada com 5 pontos na ordem de trabalhos. 11 dirigentes presentes.",
      criadoPor: "Raquel Alexandra Marques da Cunha",
      criadoEm: "2026-04-03T18:00:00Z"
    },
    {
      id: 24,
      categoria: "reunioes",
      tipo: "Reunião de Direção",
      titulo: "Reunião Ordinária de Direção • Ata 005/0526",
      subtitulo: "Pavilhão Carlos Almeida • Sala de Direção",
      data: "2026-05-20",
      horaInicio: "21:15",
      horaFim: "23:45",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Interno",
      seccao: "Direção",
      escalao: "Dirigentes",
      adversario: "Membros da Direção",
      responsavel: "Jorge Manuel da Silva Cunha",
      contacto: "966 100 115",
      estado: "Concluído",
      descricao: "Reunião de grande relevo com 14 pontos: balanço da BTT, contratação de treinadores, licenças AFA e AgitÁgueda.",
      logistica: "Minuta de ata lavrada pela secretária e aprovada pela direção.",
      criadoPor: "Raquel Alexandra Marques da Cunha",
      criadoEm: "2026-05-15T19:00:00Z"
    },
    {
      id: 25,
      categoria: "reunioes",
      tipo: "Reunião de Direção",
      titulo: "Reunião Ordinária de Direção • Ata 010/0726",
      subtitulo: "Recinto do AgitÁgueda • Banca ARCA",
      data: "2026-07-09",
      horaInicio: "21:00",
      horaFim: "23:00",
      local: "Recinto do AgitÁgueda, Águeda",
      ambito: "Interno",
      seccao: "Direção",
      escalao: "Dirigentes",
      adversario: "Membros da Direção",
      responsavel: "Jorge Manuel da Silva Cunha",
      contacto: "966 100 115",
      estado: "Concluído",
      descricao: "Coordenação da abertura da tasquinha no AgitÁgueda, preparação da Rota das Minis e Taça Jorginho.",
      logistica: "Reunião presencial no primeiro dia de funcionamento da tasquinha.",
      criadoPor: "Raquel Alexandra Marques da Cunha",
      criadoEm: "2026-07-07T12:00:00Z"
    },
    {
      id: 26,
      categoria: "reunioes",
      tipo: "Assembleia Geral",
      titulo: "Assembleia Geral Ordinária de Associados",
      subtitulo: "Apresentação e Votação do Relatório de Contas 2025",
      data: "2026-03-28",
      horaInicio: "21:00",
      horaFim: "23:30",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Interno",
      seccao: "Assembleia Geral",
      escalao: "Todos os Sócios com Quota em Dia",
      adversario: "Membros da Mesa da AG e Sócios",
      responsavel: "Presidente da Mesa da Assembleia Geral",
      contacto: "966 100 115",
      estado: "Concluído",
      descricao: "Apreciação, discussão e votação do Relatório de Gestão e Contas do Exercício de 2025 e parecer do Conselho Fiscal.",
      logistica: "Livro de presenças, controlo de quotas à entrada e emissão de ata formal da Assembleia.",
      criadoPor: "Jorge Manuel da Silva Cunha",
      criadoEm: "2026-03-10T10:00:00Z"
    },

    // -------------------------------------------------------------------------
    // 4. TAREFAS E IMPORTANTES
    // -------------------------------------------------------------------------
    {
      id: 27,
      categoria: "tarefas",
      tipo: "Manutenção",
      titulo: "Instalação da Nova Iluminação LED do Pavilhão",
      subtitulo: "Substituição de Campânulas e Armaduras",
      data: "2026-04-20",
      horaInicio: "09:00",
      horaFim: "18:00",
      local: "Pavilhão Carlos Almeida, Aguada de Baixo",
      ambito: "Instalações",
      seccao: "Património e Infraestruturas",
      escalao: "Geral",
      adversario: "Fornecedores e Voluntários",
      responsavel: "Artur Jorge Cardoso / Sérgio Novo / Jorge Cunha",
      contacto: "963 882 110",
      estado: "Concluído",
      descricao: "Carga de campânulas na Malaposta, armaduras na Climar e placas de madeira em Oiã. Montagem e teste de luminosidade no recinto de jogo.",
      logistica: "Carrinha de caixa aberta cedida pelo associado Miko e andaimes de elevação.",
      criadoPor: "Artur Jorge Ferreira Cardoso",
      criadoEm: "2026-04-09T11:00:00Z"
    },
    {
      id: 28,
      categoria: "tarefas",
      tipo: "Secretaria / FAF",
      titulo: "Inscrição Oficial das Equipas na AFA (Época 2026/27)",
      subtitulo: "Submissão de Processos e Fichas Médicas de Atletas",
      data: "2026-07-31",
      horaInicio: "10:00",
      horaFim: "18:00",
      local: "Secretaria da ARCA / Plataforma Score AFA",
      ambito: "Administrativo",
      seccao: "Secretaria Desportiva",
      escalao: "Futsal Masculino e Feminino",
      adversario: "Associação de Futebol de Aveiro",
      responsavel: "Raquel Alexandra Marques da Cunha",
      contacto: "912 345 678",
      estado: "Concluído",
      descricao: "Registo dos termos de responsabilidade, validação de exames médico-desportivos e pagamento das taxas federativas.",
      logistica: "Conferência de documentação com os treinadores e tesoureiro.",
      criadoPor: "Raquel Alexandra Marques da Cunha",
      criadoEm: "2026-07-15T15:00:00Z"
    },
    {
      id: 29,
      categoria: "tarefas",
      tipo: "Merchandising",
      titulo: "Distribuição dos Polos e T-Shirts dos 40 Anos ARCA",
      subtitulo: "Controlo de Encomendas, Pagamentos e Entregas",
      data: "2026-08-30",
      horaInicio: "09:00",
      horaFim: "19:00",
      local: "Sede da ARCA, Aguada de Baixo",
      ambito: "Associativo",
      seccao: "Marketing e Imagem",
      escalao: "Sócios e Atletas",
      adversario: "Associados Aderentes",
      responsavel: "Artur Jorge Cardoso / Danilo Saraiva",
      contacto: "963 882 110",
      estado: "Concluído",
      descricao: "Receção do lote de 68 camisolas comemorativas dos 40 anos, verificação de tamanhos e entrega mediante recibo.",
      logistica: "Tabela de encomendas conferida: 25€ para sócios, 30€ não sócios, desconto de 20€ para atletas.",
      criadoPor: "Artur Jorge Ferreira Cardoso",
      criadoEm: "2026-07-02T10:00:00Z"
    },
    {
      id: 30,
      categoria: "tarefas",
      tipo: "Contabilidade",
      titulo: "Fecho do Exercício Contabilístico e Balancete 2026",
      subtitulo: "Consolidação de Contas e Preparação para Assembleia",
      data: "2026-12-31",
      horaInicio: "09:00",
      horaFim: "18:00",
      local: "Gabinete de Tesouraria ARCA",
      ambito: "Financeiro",
      seccao: "Tesouraria e Contabilidade",
      escalao: "Direção e Conselho Fiscal",
      adversario: "Auditoria Interna",
      responsavel: "Artur Jorge Ferreira Cardoso",
      contacto: "963 882 110",
      estado: "Em Planeamento",
      descricao: "Conferência dos extratos bancários, fecho de caixas, conciliação de quotas pagas, apoios municipais e inventário de material.",
      logistica: "Emissão de balancete final para validação e parecer prévio do Conselho Fiscal.",
      criadoPor: "Artur Jorge Ferreira Cardoso",
      criadoEm: "2026-07-01T14:30:00Z"
    }
  ];

  // Expor seed para Firebase Sync e inicializações
  window.getArcaAgendaSeed = function() {
    return JSON.parse(JSON.stringify(SEED_AGENDA));
  };

  // Obter registos de Agenda com garantia de persistência local e merge de seeds
  window.getArcaAgenda = function() {
    let deletedIds = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem(DELETED_AGENDA_KEY) || '[]');
    } catch(e) {}

    try {
      const local = localStorage.getItem(AGENDA_STORAGE_KEY);
      if (local) {
        let parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (deletedIds.length > 0) {
            parsed = parsed.filter(a => !deletedIds.includes(Number(a.id)));
          }
          let added = false;
          SEED_AGENDA.forEach(seed => {
            if (!deletedIds.includes(Number(seed.id)) && !parsed.some(p => Number(p.id) === Number(seed.id))) {
              parsed.push(seed);
              added = true;
            }
          });
          parsed.sort((a, b) => new Date(b.data + 'T' + (b.horaInicio || '00:00')) - new Date(a.data + 'T' + (a.horaInicio || '00:00')));
          if (added) {
            try { localStorage.setItem(AGENDA_STORAGE_KEY, JSON.stringify(parsed)); } catch(e){}
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[ARCA Agenda] Erro ao ler agenda do localStorage:', e);
    }

    // Fallback: usar o seed oficial filtrando apagados
    const initial = SEED_AGENDA.filter(a => !deletedIds.includes(Number(a.id)));
    initial.sort((a, b) => new Date(b.data + 'T' + (b.horaInicio || '00:00')) - new Date(a.data + 'T' + (a.horaInicio || '00:00')));
    try {
      localStorage.setItem(AGENDA_STORAGE_KEY, JSON.stringify(initial));
    } catch(e) {}
    return initial;
  };

  window.saveArcaAgendaLocal = function(list) {
    try {
      localStorage.setItem(AGENDA_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('[ARCA Agenda] Erro ao gravar agenda no localStorage:', e);
    }
  };

})();
