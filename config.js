// ==============================================================================
// CONFIGURAÇÃO DO FUNIL E SAAS - 7 DIAS COM JESUS
// ==============================================================================

window.APP_CONFIG = {
  // Nome oficial do projeto
  appName: "7 Dias com Jesus",
  tagline: "Uma jornada diária de paz, restauração e intimidade com Cristo",
  
  // Link Oficial de Checkout da Tutora
  tutoraCheckoutUrl: "https://pay.tutora.co.mz/3c527900a74a4fa3b05bda77f5648349",

  // Conexão Supabase
  supabase: {
    url: "https://eokhadlpvyuejulwxnvq.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVva2hhZGxwdnl1ZWp1bHd4bnZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMTYzNzAsImV4cCI6MjEwNzg5MjM3MH0.D0mhnjS1qij48NsJkLgJonC5VObZ79yIRj0qlDBkozo"
  },
  
  // Detalhes da Oferta
  pricing: {
    amount: "197",
    currency: "MT",
    format: "197 MT",
    period: "Acesso Completo e Ilimitado",
    regularPrice: "890 MT"
  },
  
  // Métodos de pagamento oficiais disponíveis na Tutora
  paymentMethods: [
    "M-Pesa (Moçambique · MZN)",
    "E-Mola (Moçambique · MZN)",
    "Multicaixa Express (Angola · AOA)",
    "PayFast (África do Sul · ZAR)",
    "Cartão de Crédito/Débito (Stripe)",
    "PayPal (Internacional)"
  ],
  
  // Delay do Pitch (em segundos):
  // 0 = A oferta fica visível imediatamente abaixo do vídeo
  // > 0 = A oferta aparece após X segundos de exibição do vídeo
  pitchDelaySeconds: 0,
  
  // Contato de Suporte
  support: {
    whatsappNumber: "258840000000",
    whatsappMessage: "Olá! Gostaria de tirar dúvidas sobre o programa 7 Dias com Jesus.",
    email: "suporte@7diascomjesus.com"
  },

  // Dados do Aplicativo Web / Experiência dos 7 Dias
  journeyData: [
    {
      day: 1,
      title: "O Nascimento de Jesus",
      subtitle: "A Esperança que Rompeu o Silêncio",
      theme: "Origem, Contexto e Profecias Cumpridas",
      bibleReference: "Lucas 2:10-14 & Isaías 9:6",
      biblePassage: "“Porque um menino nos nasceu, um filho se nos deu; e o governo estará sobre os seus ombros; e o seu nome será: Maravilhoso Conselheiro, Deus Forte, Pai da Eternidade, Príncipe da Paz.”",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Vídeo complementar ou explicativo
      durationMinutes: "5 min",
      devotionalText: `Antes do nascimento de Jesus, o povo viveu mais de 400 anos de silêncio profético. Em meio à escuridão e ao domínio do Império Romano, a promessa de redenção parecia distante. Mas Deus não havia esquecido o Seu povo.
      
      Jesus não nasceu num palácio dourado rodeado de riquezas; nasceu numa manjedoura humilde em Belém. Este detalhe não foi acidental: Deus escolheu o caminho da humildade para mostrar que a Sua graça está ao alcance de todos — do mais simples ao mais poderoso.
      
      Hoje, ao iniciar esta jornada, lembre-se: independentemente do momento de angústia ou incerteza que esteja a atravessar, o mesmo Deus que rompeu séculos de silêncio para trazer luz ao mundo quer nascer e renovar o seu coração.`,
      reflectionQuestion: "Em que área da sua vida você precisa permitir que a paz e a esperança de Cristo renasçam hoje?",
      prayer: "Senhor Deus, Pai de amor, agradeço-Te por teres enviado Teu único Filho Jesus a este mundo com tanta humildade e compaixão. Peço que nesta jornada de 7 dias o Teu Espírito Santo abra os meus olhos espirituais. Renova a minha fé, dissipa o medo e faz nascer no meu coração uma nova esperança. Em nome de Jesus, Amém."
    },
    {
      day: 2,
      title: "A Mensagem de Jesus",
      subtitle: "O Sermão do Monte e o Reino Invertido",
      theme: "Ensinamentos, Amor ao Próximo e Parábolas de Vida",
      bibleReference: "Mateus 5:3-12 & Mateus 7:24-25",
      biblePassage: "“Todo aquele, pois, que ouve estas minhas palavras e as pratica será comparado a um homem prudente, que construiu a sua casa sobre a rocha.”",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      durationMinutes: "4 min",
      devotionalText: `A mensagem de Jesus revolucionou o mundo. Quando Ele subiu ao monte e começou a ensinar, quebrou todas as expectativas dos mestres da época. Ele não valorizou a arrogância dos fariseus nem o poder dos guerreiros, mas exaltou os humildes de espírito, os pacificadores e os que têm sede de justiça.
      
      Através de parábolas simples — como a do Bom Samaritano, do Filho Pródigo e do Grão de Mostarda —, Jesus ensinou que o Reino de Deus não é sobre regras vazias, mas sobre transformação do coração e amor incondicional ao próximo.
      
      Construir a vida sobre a rocha de Cristo significa alinhar as nossas decisões diárias com os Seus mandamentos de misericórdia, verdade e perdão.`,
      reflectionQuestion: "A sua vida tem sido construída sobre a rocha dos ensinamentos de Jesus ou sobre a areia das preocupações e opiniões humanas?",
      prayer: "Mestre amado, Teus ensinamentos são lâmpada para os meus pés. Ajuda-me a não ser apenas um ouvinte, mas um praticante da Tua Palavra. Ensina-me a amar aqueles que são difíceis de amar e a perdoar de todo o coração. Firmo a minha casa sobre a Tua verdade. Amém."
    },
    {
      day: 3,
      title: "Os Milagres de Jesus",
      subtitle: "O Olhar da Compaixão que Restaura",
      theme: "Curas, Libertação e o Significado Espiritual dos Milagres",
      bibleReference: "Mateus 14:14 & Marcos 5:34",
      biblePassage: "“Jesus, saindo, viu uma grande multidão e, possuído de íntima compaixão para com ela, curou os seus enfermos.”",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      durationMinutes: "5 min",
      devotionalText: `Os milagres de Jesus nunca foram demonstrações de poder para impressionar plateias curiosas. Em quase todos os relatos nos Evangelhos, uma expressão se repete: 'possuído de íntima compaixão'.
      
      Jesus curou o cego de nascença, limpou o leproso rejeitado pela sociedade, acalmou a tempestade no Mar da Galileia e multiplicou pães e peixes para alimentar os famintos. Cada milagre revelava que Deus se importa com a dor humana, tanto física quanto espiritual.
      
      O maior milagre, contudo, é a transformação interior: quando Jesus toca na alma ferida e substitui a vergonha pela dignidade e a culpa pelo perdão.`,
      reflectionQuestion: "Qual é o fardo ou impossibilidade que você precisa colocar hoje nas mãos de Jesus com total fé?",
      prayer: "Senhor Jesus, creio que Tu és o mesmo ontem, hoje e para sempre. Coloco diante do Teu altar a minha dor, as minhas limitações e as batalhas que não consigo vencer sozinho. Libera sobre a minha família a Tua bênção e restauração. Creio no Teu agir milagroso! Amém."
    },
    {
      day: 4,
      title: "A Última Ceia",
      subtitle: "A Nova Aliança Selada com Amor",
      theme: "Comunhão, Humildade no Lava-Pés e Oração no Getsêmani",
      bibleReference: "Lucas 22:19-20 & João 13:12-15",
      biblePassage: "“Isto é o meu corpo oferecido por vós; fazei isto em memória de mim. Do mesmo modo, depois da ceia, tomou o cálice, dizendo: Este cálice é a nova aliança no meu sangue derramado por vós.”",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      durationMinutes: "6 min",
      devotionalText: `Na noite anterior à Sua crucificação, Jesus reuniu os Seus discípulos num cenáculo em Jerusalém. Sabendo exatamente quem o trairia e o que enfrentaria poucas horas depois, Ele pegou numa bacia com água e lavou os pés poeirentos de cada discípulo.
      
      O Criador do universo ajoelhou-se como o mais humilde dos servos. Ao repartir o pão e o vinho, instituiu a Ceia do Senhor: um memorial perpétuo do Seu amor sacrificial.
      
      Mais tarde, no jardim do Getsêmani, em agonia de oração, Ele orou: 'Pai, se for possível, afasta de mim este cálice; todavia, não se faça a minha vontade, mas a tua'. Esta entrega absoluta nos ensina a confiar nos planos de Deus mesmo nos momentos de angústia.`,
      reflectionQuestion: "Você está disposto a submeter a sua própria vontade à vontade perfeita de Deus, confiando que Ele sabe o melhor?",
      prayer: "Pai celestial, ensina-me a humildade de Jesus. Ajuda-me a servir e a honrar as pessoas ao meu redor. Nos momentos de dor e incerteza, dá-me a graça de orar com sinceridade: que a Tua vontade prevaleça em todas as áreas da minha vida. Amém."
    },
    {
      day: 5,
      title: "A Crucificação",
      subtitle: "O Sacrifício Supremo da Redenção",
      theme: "O Peso da Cruz, o Perdão dos Inimigos e a Consumação",
      bibleReference: "Isaías 53:4-5 & Lucas 23:33-34",
      biblePassage: "“Mas ele foi traspassado pelas nossas transgressões e moído pelas nossas iniquidades; o castigo que nos traz a paz estava sobre ele, e pelas suas pisaduras fomos sarados.”",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      durationMinutes: "5 min",
      devotionalText: `A cruz de Cristo não foi uma derrota; foi a maior demonstração de amor e vitória de toda a história humana. Jesus subiu o Monte Calvário carregando não apenas uma cruz de madeira, mas as dores, os pecados e as condenações de toda a humanidade.
      
      Mesmo sofrendo as maiores humilhações e dores inimagináveis, as Suas palavras foram de reconciliação: 'Pai, perdoa-lhes, porque não sabem o que fazem'. E no Seu último suspiro declarou: 'Está consumado!' — a dívida da humanidade estava paga por completo.
      
      Você nunca mais precisa viver com o peso da condenação. Na cruz, Jesus conquistou para si a liberdade, a reconciliação e o abraço do Pai Eterno.`,
      reflectionQuestion: "Você já aceitou verdadeiramente o perdão de Deus para se libertar da culpa do passado?",
      prayer: "Jesus, meu Salvador, o Teu sacrifício na cruz foi por mim. Obrigado por teres suportado as minhas dores e cancelado a minha dívida. Eu renuncio a todo sentimento de culpa, rejeição e vergonha. Recebo o Teu perdão abundante e declaro que sou livre pela Tua graça. Amém."
    },
    {
      day: 6,
      title: "A Ressurreição",
      subtitle: "O Túmulo Está Vazio: A Morte Foi Vencida",
      theme: "A Vitória Gloriosa, o Pilar da Fé e a Vida Eterna",
      bibleReference: "Mateus 28:5-6 & 1 Coríntios 15:55-57",
      biblePassage: "“O anjo disse às mulheres: Não temais; porque sei que buscais a Jesus, que foi crucificado. Ele não está aqui; ressuscitou, como tinha dito. Vinde ver onde ele jazia.”",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      durationMinutes: "4 min",
      devotionalText: `No primeiro dia da semana, de madrugada, as mulheres foram ao sepulcro esperando encontrar um corpo sepultado. Em vez disso, encontraram a pedra removida e um anjo com a notícia mais extraordinária que a terra já ouviu: 'Ele não está aqui; ressuscitou!'
      
      A ressurreição de Jesus Cristo é a pedra angular da fé cristã. Se Jesus tivesse permanecido no túmulo, Ele seria apenas mais um líder sábio do passado. Mas porque Ele ressuscitou, a morte perdeu o seu ferrão e o desespero perdeu a sua força.
      
      Porque Ele vive, você pode crer no amanhã. Há esperança para a sua família, para a sua saúde e para o seu futuro espiritual.`,
      reflectionQuestion: "De que forma saber que Jesus está vivo e presente muda a sua maneira de encarar os desafios do dia a dia?",
      prayer: "Senhor Ressurreto, eu Te louvo com toda a minha força! A morte não pôde Te conter, o inferno foi derrotado e Tu reinas para sempre. Sopra a Tua vida e o Teu fogo restaurador sobre os meus sonhos e sobre o meu lar. Eu sirvo a um Deus vivo! Amém."
    },
    {
      day: 7,
      title: "O Legado de Jesus",
      subtitle: "A Grande Comissão e a Sua Presença Conosco",
      theme: "Viver como Discípulo, Ser Luz no Mundo e a Promessa Eterna",
      bibleReference: "Mateus 28:18-20 & Atos 1:8",
      biblePassage: "“E eis que estou convosco todos os dias, até à consumação dos séculos.”",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      durationMinutes: "5 min",
      devotionalText: `Esta jornada de 7 dias chega ao seu último capítulo, mas a sua caminhada com Jesus está apenas a começar. Antes de ascender aos céus, Jesus deixou uma missão e uma promessa indelével: 'Ide por todo o mundo e pregai o evangelho... e eis que estou convosco todos os dias'.
      
      O legado de Jesus não é um museu de ideias antigas; é um movimento vivo no coração de milhões de homens e mulheres que decidem refletir a Sua luz, a Sua bondade e o Seu caráter onde quer que vão.
      
      Você foi chamado para ser sal da terra e luz do mundo em Moçambique, na sua comunidade e onde quer que você pise. Leve a mensagem de Cristo adiante e viva cada dia sob a Sua constante presença.`,
      reflectionQuestion: "Como você continuará a nutrir o seu relacionamento com Jesus a partir de hoje?",
      prayer: "Jesus amado, chego ao fim destes 7 dias com o coração transbordando de gratidão. Obrigado por cada lição, cada momento de oração e pela Tua doce presença. Consagro a minha vida inteira a Ti. Usa-me para abençoar vidas e levar a Tua luz ao mundo. Permaneço em Ti para sempre. Amém!"
    }
  ]
};
