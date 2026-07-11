import { useState, useEffect } from "react";

const TOTAL_WEEKS = 24;

const phases = [
  { id: 1, label: "Fase 1", weeks: "Semanas 1–6",   weekRange: [1, 6],   subtitle: "Base sólida",    color: "#4F86C6", bg: "#EBF3FB", description: "Fundamentos de todas as áreas. Prioridade alta em Matemática." },
  { id: 2, label: "Fase 2", weeks: "Semanas 7–14",  weekRange: [7, 14],  subtitle: "Aprofundamento", color: "#5BAD72", bg: "#EBF7EF", description: "Conteúdos intermediários e conexão entre áreas." },
  { id: 3, label: "Fase 3", weeks: "Semanas 15–20", weekRange: [15, 20], subtitle: "Integração",      color: "#E08A2F", bg: "#FDF3E7", description: "Conteúdos avançados, exercícios e revisão cruzada." },
  { id: 4, label: "Fase 4", weeks: "Semanas 21–24", weekRange: [21, 24], subtitle: "Revisão Final",   color: "#C0524A", bg: "#FBECEA", description: "Revisão geral, simulados e reforço nos pontos fracos." },
];

// Estrutura diária:
// Seg → Matemática (1 tópico)
// Ter → Linguagens: Português / Inglês / Espanhol (alternando)
// Qua → Matemática (1 tópico)
// Qui → Ciências Humanas: História / Geografia / Filosofia
// Sex → Ciências da Natureza: Biologia / Química / Física
// Sáb manhã → Matemática (exercícios/revisão do tópico da semana)
// Sáb tarde → Linguagens (Arte / Ed. Física / Inglês / Espanhol extras)
// Dom manhã → Ciências da Natureza (tópico extra)
// Dom tarde → Revisão geral / Ciências Humanas extra / Filosofia

const schedule = {
  // ══════════════════════════════════════════════
  // FASE 1 — BASE SÓLIDA (Semanas 1–6)
  // ══════════════════════════════════════════════
  1: {
    seg:  { area: "Matemática",           topic: "Conjuntos numéricos: subconjuntos, representações e operações" },
    ter:  { area: "Linguagens · Port",    topic: "Campo jornalístico: condições de produção, circulação e recepção" },
    qua:  { area: "Matemática",           topic: "Reta real, sistema cartesiano e representação de números" },
    qui:  { area: "História",             topic: "Fontes históricas, tempos, calendários e pré-história" },
    sex:  { area: "Biologia",             topic: "Metodologia científica" },
    sab1: { area: "Matemática",           topic: "Exercícios: conjuntos numéricos e reta real" },
    sab2: { area: "Linguagens · Arte",    topic: "Significado e funções sociais da Arte; conceitos de estesia, fruição e crítica" },
    dom1: { area: "Química",              topic: "Estados físicos e mudanças de estado; transformações físicas e químicas" },
    dom2: { area: "Revisão",              topic: "Revisão leve da semana + organização de anotações" },
  },
  2: {
    seg:  { area: "Matemática",           topic: "Razão e proporção; taxas e índices" },
    ter:  { area: "Linguagens · Port",    topic: "Texto argumentativo: tese, tipos de argumentos e parágrafos" },
    qua:  { area: "Matemática",           topic: "Proporcionalidade direta e inversa" },
    qui:  { area: "História",             topic: "Evolução biológica e cultural; povos indígenas do Brasil e povoamento das Américas" },
    sex:  { area: "Biologia",             topic: "Bioquímica: água e sais minerais" },
    sab1: { area: "Matemática",           topic: "Exercícios: razão, proporção e regra de três" },
    sab2: { area: "Linguagens · Arte",    topic: "Análise de produções artísticas: aspectos estéticos, formais, históricos e culturais" },
    dom1: { area: "Química",              topic: "Átomos, elementos, isótopos; modelo atômico de Dalton e Thomson" },
    dom2: { area: "Revisão",              topic: "Revisão de História e Bioquímica da semana" },
  },
  3: {
    seg:  { area: "Matemática",           topic: "Expressões algébricas: operações e simplificação" },
    ter:  { area: "Linguagens · Inglês",  topic: "Produção/circulação de discursos em inglês; cognates e false cognates; Plural of Nouns" },
    qua:  { area: "Matemática",           topic: "Equações do 1º grau e sistemas lineares" },
    qui:  { area: "Geografia",            topic: "Paisagens naturais e culturais; princípios clássicos; correntes do pensamento geográfico" },
    sex:  { area: "Biologia",             topic: "Bioquímica: carboidratos e lipídios" },
    sab1: { area: "Matemática",           topic: "Exercícios: equações do 1º grau e sistemas" },
    sab2: { area: "Linguagens · Arte",    topic: "Patrimônio material e imaterial; diversidade étnica e cultural" },
    dom1: { area: "Química",              topic: "Modelos atômicos de Rutherford e Bohr; tabela periódica" },
    dom2: { area: "Revisão",              topic: "Revisão de Geografia e Química da semana" },
  },
  4: {
    seg:  { area: "Matemática",           topic: "Funções: conceito, representações e domínio/imagem" },
    ter:  { area: "Linguagens · Inglês",  topic: "Personal Pronouns; Verb to be (presente, passado, futuro); Interrogative Pronouns" },
    qua:  { area: "Matemática",           topic: "Função afim: coeficientes, raízes e gráfico" },
    qui:  { area: "Geografia",            topic: "Conceitos: espaço geográfico, território, região, paisagem, lugar e geossistema" },
    sex:  { area: "Biologia",             topic: "Bioquímica: proteínas, ácidos nucleicos, vitaminas e avitaminoses" },
    sab1: { area: "Matemática",           topic: "Exercícios: função afim e interpretação de gráficos" },
    sab2: { area: "Linguagens · EF",      topic: "Dança: história das danças populares, urbanas e de massa; fundamentos (espaço, tempo, peso, corpo)" },
    dom1: { area: "Química",              topic: "Substâncias simples e compostas; misturas; alotropia" },
    dom2: { area: "Revisão",              topic: "Revisão de funções e conceitos geográficos" },
  },
  5: {
    seg:  { area: "Matemática",           topic: "Função quadrática: raízes, vértice e coeficientes" },
    ter:  { area: "Linguagens · Port",    topic: "Variação linguística: regional, histórica, social e etária; preconceito linguístico" },
    qua:  { area: "Matemática",           topic: "Função quadrática: gráfico, máximo e mínimo" },
    qui:  { area: "Filosofia",            topic: "Origem da filosofia; conceitos filosóficos; filosofia vs mito, ciência e senso comum" },
    sex:  { area: "Biologia",             topic: "Origem da vida: hipóteses e teorias; surgimento dos primeiros seres vivos" },
    sab1: { area: "Matemática",           topic: "Exercícios: função quadrática (questões de vestibular)" },
    sab2: { area: "Linguagens · EF",      topic: "Danças pernambucanas: frevo, maracatu nação, maracatu de baque solto, cavalo-marinho, caboclinho" },
    dom1: { area: "Química",              topic: "Ligações químicas: iônica, covalente e metálica" },
    dom2: { area: "Revisão",              topic: "Revisão de Filosofia e Biologia da semana" },
  },
  6: {
    seg:  { area: "Matemática",           topic: "Função exponencial: conceito, domínio, imagem e equações exponenciais" },
    ter:  { area: "Linguagens · Port",    topic: "Gêneros literários: conto, crônica, fábula e poema" },
    qua:  { area: "Matemática",           topic: "Função inversa e taxa de variação; crescimento e decrescimento" },
    qui:  { area: "Filosofia",            topic: "Pré-socráticos" },
    sex:  { area: "Biologia",             topic: "Evolução e diversificação biológica; níveis de organização" },
    sab1: { area: "Matemática",           topic: "Exercícios: função exponencial e revisão de funções (afim, quadrática, exponencial)" },
    sab2: { area: "Linguagens · Port",    topic: "Figuras de linguagem e intertextualidade" },
    dom1: { area: "Química",              topic: "Fórmulas químicas e estruturais; separação de misturas" },
    dom2: { area: "Revisão",              topic: "Revisão de toda a Fase 1 — mapa mental geral" },
  },

  // ══════════════════════════════════════════════
  // FASE 2 — APROFUNDAMENTO (Semanas 7–14)
  // ══════════════════════════════════════════════
  7: {
    seg:  { area: "Matemática",           topic: "PA: termo geral e soma de n termos; relação com função afim" },
    ter:  { area: "Linguagens · Port",    topic: "Semântica, campo semântico, humor e ironia" },
    qua:  { area: "Matemática",           topic: "PG: termo geral, soma e produto de n termos; PG decrescente infinita" },
    qui:  { area: "História",             topic: "Revolução Neolítica: agricultura, cidades, Estado e religiões" },
    sex:  { area: "Biologia",             topic: "Citologia: estruturas celulares (procariotos e eucariotos) e organelas" },
    sab1: { area: "Matemática",           topic: "Exercícios: PA e PG em contextos reais; relação PG e função exponencial" },
    sab2: { area: "Linguagens · Inglês",  topic: "Present Simple e adverbs of frequency; Present Continuous" },
    dom1: { area: "Física",               topic: "Grandezas escalares e vetoriais; operações com vetores; ordem de grandeza e notação científica" },
    dom2: { area: "Revisão",              topic: "Revisão de PA/PG e citologia" },
  },
  8: {
    seg:  { area: "Matemática",           topic: "Geometria: área e perímetro de figuras planas" },
    ter:  { area: "Linguagens · Port",    topic: "Multimodalidade e semioses em textos digitais" },
    qua:  { area: "Matemática",           topic: "Volume de paralelepípedo retangular; conversão de unidades" },
    qui:  { area: "História",             topic: "Egito: civilização mediterrânica e africana" },
    sex:  { area: "Biologia",             topic: "Membranas: permeabilidade, endocitose e exocitose" },
    sab1: { area: "Matemática",           topic: "Exercícios: geometria plana, volumes e conversão de unidades" },
    sab2: { area: "Linguagens · Inglês",  topic: "Possessive Adjectives, Pronouns e Case ('s); There + be" },
    dom1: { area: "Física",               topic: "Cinemática: posição, tempo, velocidade; Movimento Uniforme (MU)" },
    dom2: { area: "Revisão",              topic: "Revisão de geometria e cinemática" },
  },
  9: {
    seg:  { area: "Matemática",           topic: "Notação científica, ordem de grandeza e algarismos significativos" },
    ter:  { area: "Linguagens · Espanhol",topic: "Produção e circulação de discursos em espanhol; ideia principal e informações secundárias" },
    qua:  { area: "Matemática",           topic: "Probabilidade: conceito, espaço amostral e eventos" },
    qui:  { area: "História",             topic: "Antigo Oriente Médio" },
    sex:  { area: "Biologia",             topic: "Fotossíntese e quimiossíntese" },
    sab1: { area: "Matemática",           topic: "Exercícios: probabilidade e notação científica" },
    sab2: { area: "Linguagens · Espanhol",topic: "Marcadores discursivos, conectores e relações temporais; tempos verbais em espanhol" },
    dom1: { area: "Física",               topic: "MUV e lançamento vertical" },
    dom2: { area: "Revisão",              topic: "Revisão de Espanhol e Física" },
  },
  10: {
    seg:  { area: "Matemática",           topic: "Gráficos, infográficos e tabelas: leitura e interpretação" },
    ter:  { area: "Linguagens · Port",    topic: "Campo jornalístico-midiático: leitura crítica, checagem de fatos e fotos" },
    qua:  { area: "Matemática",           topic: "Medidas de tendência central: média, moda e mediana" },
    qui:  { area: "História",             topic: "Civilização Grega: arte, política, pensamento, sociedade e religiosidade" },
    sex:  { area: "Biologia",             topic: "Respiração celular e fermentação" },
    sab1: { area: "Matemática",           topic: "Exercícios: gráficos, tabelas e medidas de tendência central" },
    sab2: { area: "Linguagens · Port",    topic: "Fake news, bolhas e manipulação na internet; curadoria em redes sociais" },
    dom1: { area: "Física",               topic: "Movimento relativo; lançamento parabólico horizontal e oblíquo" },
    dom2: { area: "Revisão",              topic: "Revisão de História e Física: lançamentos" },
  },
  11: {
    seg:  { area: "Matemática",           topic: "Medidas de dispersão: variância e desvio padrão" },
    ter:  { area: "Linguagens · Inglês",  topic: "Past Simple: verbos regulares e irregulares" },
    qua:  { area: "Matemática",           topic: "Revisão: estatística completa com exercícios contextualizados" },
    qui:  { area: "História",             topic: "Civilização Romana: arte, política, pensamento e religiosidade; gregos e romanos na África" },
    sex:  { area: "Biologia",             topic: "Divisão celular: binária e mitose" },
    sab1: { area: "Matemática",           topic: "Mini-simulado: Estatística e Probabilidade" },
    sab2: { area: "Linguagens · Inglês",  topic: "Past Continuous; Future com going to e will" },
    dom1: { area: "Física",               topic: "Movimento circular: MCU e MCUA; velocidade tangencial e angular" },
    dom2: { area: "Revisão",              topic: "Revisão de divisão celular e movimento circular" },
  },
  12: {
    seg:  { area: "Matemática",           topic: "Equações do 2º grau: resolução e análise do discriminante" },
    ter:  { area: "Linguagens · Port",    topic: "Literatura barroca e árcade" },
    qua:  { area: "Matemática",           topic: "Sistemas lineares e representação geométrica" },
    qui:  { area: "História",             topic: "Europa medieval (séculos IV–XV): fim do mundo clássico, arte, política e religiosidade" },
    sex:  { area: "Biologia",             topic: "Meiose; replicação, transcrição, código genético e tradução" },
    sab1: { area: "Matemática",           topic: "Exercícios: equações do 2º grau e sistemas lineares" },
    sab2: { area: "Linguagens · Port",    topic: "Literatura africana em língua portuguesa; macrossistema literário em língua portuguesa" },
    dom1: { area: "Física",               topic: "Aceleração centrípeta e tangencial; Leis de Newton" },
    dom2: { area: "Revisão",              topic: "Revisão de literatura e Leis de Newton" },
  },
  13: {
    seg:  { area: "Matemática",           topic: "Revisão geral: funções (afim, quadrática, exponencial) com exercícios de vestibular" },
    ter:  { area: "Linguagens · Espanhol",topic: "Tipologias textuais em espanhol; coesão e coerência textual" },
    qua:  { area: "Matemática",           topic: "Revisão geral: PA, PG e geometria com exercícios" },
    qui:  { area: "História",             topic: "Cidades e comércio medievais; Império Muçulmano: origens e sociedades islâmicas" },
    sex:  { area: "Biologia",             topic: "Reprodução assexuada e sexuada; fecundação" },
    sab1: { area: "Matemática",           topic: "Simulado temático da Fase 2 — Matemática" },
    sab2: { area: "Linguagens · Espanhol",topic: "Recursos multissemióticos em espanhol; aspectos culturais de países hispanofalantes" },
    dom1: { area: "Física",               topic: "Sistemas inerciais; força de atrito, peso, normal, tração e força centrípeta" },
    dom2: { area: "Revisão",              topic: "Revisão de Espanhol e reprodução biológica" },
  },
  14: {
    seg:  { area: "Matemática",           topic: "Revisão e correção de erros do simulado da Fase 2" },
    ter:  { area: "Linguagens · Port",    topic: "Campo da vida pessoal: culturas juvenis, Slams e intervenções urbanas" },
    qua:  { area: "Matemática",           topic: "Reforço nos tópicos mais errados (identificados no simulado)" },
    qui:  { area: "História",             topic: "Viajantes medievais; relações islâmicas com culturas não islâmicas" },
    sex:  { area: "Biologia",             topic: "Embriologia: segmentação, blastulação, gastrulação e organogênese" },
    sab1: { area: "Matemática",           topic: "Exercícios mistos: todos os tópicos da Fase 2" },
    sab2: { area: "Linguagens · EF",      topic: "Lutas: capoeira Angola e Regional; Huka Huka indígena; história, movimentos e rituais" },
    dom1: { area: "Química",              topic: "Funções químicas: ácidos e bases; conceitos de Brönsted-Lowry e Lewis" },
    dom2: { area: "Revisão",              topic: "Revisão geral da Fase 2 — pontos-chave de todas as áreas" },
  },

  // ══════════════════════════════════════════════
  // FASE 3 — INTEGRAÇÃO (Semanas 15–20)
  // ══════════════════════════════════════════════
  15: {
    seg:  { area: "Matemática",           topic: "Aprofundamento: função exponencial, logaritmos (introdução) e equações" },
    ter:  { area: "Linguagens · Port",    topic: "Campo das práticas de estudo: divulgação científica, discurso reportado e fontes confiáveis" },
    qua:  { area: "Matemática",           topic: "Exercícios avançados: funções (questões ENEM e vestibular)" },
    qui:  { area: "Filosofia",            topic: "Sócrates, Platão e Aristóteles" },
    sex:  { area: "Biologia",             topic: "Histologia: tecidos epiteliais e conjuntivos" },
    sab1: { area: "Matemática",           topic: "Exercícios: logaritmos e exponenciais (nível avançado)" },
    sab2: { area: "Linguagens · Arte",    topic: "Elementos da linguagem musical, visual, da dança e do teatro" },
    dom1: { area: "Química",              topic: "Funções químicas: sais e óxidos" },
    dom2: { area: "Filosofia",            topic: "Ética, valores e sociedade; trabalho, cultura e natureza; cidadania, democracia e liberdade" },
  },
  16: {
    seg:  { area: "Matemática",           topic: "Estatística aplicada: interpretação crítica de dados reais e infográficos" },
    ter:  { area: "Linguagens · Inglês",  topic: "Modal verbs (can, could, may, might, shall, should, ought to, will, would)" },
    qua:  { area: "Matemática",           topic: "Geometria analítica: plano cartesiano (revisão e aprofundamento)" },
    qui:  { area: "Geografia",            topic: "Cartografia: coordenadas geográficas; componentes e tipos de mapas" },
    sex:  { area: "Biologia",             topic: "Histologia: tecidos de sustentação, transporte, musculares e nervoso" },
    sab1: { area: "Matemática",           topic: "Simulado temático: Estatística + Geometria" },
    sab2: { area: "Linguagens · Inglês",  topic: "Conectores (but, however, although, yet, if); Prepositions; Indefinite pronouns" },
    dom1: { area: "Química",              topic: "Propriedades dos materiais; reciclagem, sustentabilidade e lixo" },
    dom2: { area: "Geografia",            topic: "Escalas e projeções cartográficas; sensoriamento remoto; imagens de satélite; ferramentas tecnológicas" },
  },
  17: {
    seg:  { area: "Matemática",           topic: "Revisão intensiva: PA e PG com exercícios de alto nível" },
    ter:  { area: "Linguagens · Port",    topic: "Campo da vida pública: participação social; documentos legais e normativos (direitos e deveres)" },
    qua:  { area: "Matemática",           topic: "Revisão intensiva: equações, sistemas e proporcionalidade em contextos" },
    qui:  { area: "Geografia",            topic: "Relações Terra-Sol: movimentos e consequências geográficas; energia solar e sustentabilidade" },
    sex:  { area: "Biologia",             topic: "Aspectos sociais: transtornos alimentares (anorexia, bulimia) e transtornos psicológicos (ansiedade, depressão, síndrome do pânico)" },
    sab1: { area: "Matemática",           topic: "Exercícios mistos: todos os tópicos (questões de vestibular)" },
    sab2: { area: "Linguagens · Inglês",  topic: "Quantifiers (much, many, some, any, little, few, less, most); Present Perfect" },
    dom1: { area: "Química",              topic: "Ciclos biogeoquímicos: C, N, O, S, P, Ca e H" },
    dom2: { area: "Filosofia",            topic: "Renascimento e Empirismo (Locke); Racionalismo (Descartes) e Positivismo" },
  },
  18: {
    seg:  { area: "Matemática",           topic: "Revisão: geometria plana e espacial com problemas contextualizados" },
    ter:  { area: "Linguagens · Espanhol",topic: "Formalidade e informalidade em espanhol; estruturas pronominais e verbais" },
    qua:  { area: "Matemática",           topic: "Simulado completo de Matemática (2h — condições reais)" },
    qui:  { area: "Geografia",            topic: "Estrutura interna do planeta; geoesferas e placas litosféricas" },
    sex:  { area: "Biologia",             topic: "Drogas lícitas e ilícitas; ISTs (HIV e sífilis); puberdade, sexualidade e diversidade sexual; primeiros socorros" },
    sab1: { area: "Matemática",           topic: "Correção e análise dos erros do simulado" },
    sab2: { area: "Linguagens · Espanhol",topic: "Variedades linguísticas do espanhol; direitos humanos, meio ambiente e consumo responsável" },
    dom1: { area: "Química",              topic: "Radioatividade: isótopos radioativos, meia-vida e datação por C-14" },
    dom2: { area: "Filosofia",            topic: "Iluminismo e Marxismo" },
  },
  19: {
    seg:  { area: "Matemática",           topic: "Reforço nos tópicos com mais erros (identificados no simulado)" },
    ter:  { area: "Linguagens · Port",    topic: "Concordância verbal e nominal" },
    qua:  { area: "Matemática",           topic: "Exercícios de interpretação: gráficos, tabelas e infográficos" },
    qui:  { area: "Geografia",            topic: "Relevo: morfoesculturas, morfoestruturas e relevo submarino; rochas e solos" },
    sex:  { area: "Biologia",             topic: "Ecologia: relações intraespecíficas e interespecíficas" },
    sab1: { area: "Matemática",           topic: "Exercícios: probabilidade, estatística e notação científica" },
    sab2: { area: "Linguagens · Port",    topic: "Regência verbal e nominal" },
    dom1: { area: "Química",              topic: "Reações e equações químicas; balanceamento" },
    dom2: { area: "Filosofia",            topic: "Escola de Frankfurt / Teoria Crítica; indústria cultural e cultura de massa" },
  },
  20: {
    seg:  { area: "Matemática",           topic: "Revisão: funções e progressões com questões integradas" },
    ter:  { area: "Linguagens · Port",    topic: "Literatura pernambucana: contemporânea e canônica; literatura popular e regional" },
    qua:  { area: "Matemática",           topic: "Revisão: Probabilidade e Estatística com questões integradas" },
    qui:  { area: "Geografia",            topic: "Clima: tempo, tipologia, mudanças climáticas, climas urbanos e poluição atmosférica" },
    sex:  { area: "Biologia",             topic: "Ecossistemas; fluxo de energia; cadeia e teia alimentar" },
    sab1: { area: "Matemática",           topic: "Simulado temático: Funções + Progressões + Geometria" },
    sab2: { area: "Linguagens · Arte",    topic: "Técnicas e materiais nas artes visuais; gêneros na dança; danças pernambucanas" },
    dom1: { area: "Química",              topic: "Mol e cálculo estequiométrico; pureza e rendimento" },
    dom2: { area: "Revisão",              topic: "Revisão de toda a Fase 3 — pontos-chave de todas as áreas" },
  },

  // ══════════════════════════════════════════════
  // FASE 4 — REVISÃO FINAL (Semanas 21–24)
  // ══════════════════════════════════════════════
  21: {
    seg:  { area: "Matemática",           topic: "Revisão final: Funções (afim, quadrática, exponencial) + exercícios" },
    ter:  { area: "Linguagens · Inglês",  topic: "Phrasal verbs e Comparisons; revisão geral de gramática inglesa" },
    qua:  { area: "Matemática",           topic: "Revisão final: PA, PG e Estatística + exercícios" },
    qui:  { area: "Geografia",            topic: "Recursos hídricos: bacias hidrográficas, oceanos e águas subterrâneas" },
    sex:  { area: "Biologia",             topic: "Ações antrópicas: poluição, eutrofização, bioacumulação e biomagnificação" },
    sab1: { area: "Matemática",           topic: "Simulado final de Matemática (prova completa em condições reais)" },
    sab2: { area: "Linguagens · Arte",    topic: "Gêneros musicais urbanos; ritmos pernambucanos; teatro de bonecos em Pernambuco" },
    dom1: { area: "Química",              topic: "Cálculo com gases: CNTP e volume molar" },
    dom2: { area: "Filosofia",            topic: "Ética do discurso; razão comunicativa vs. razão instrumental" },
  },
  22: {
    seg:  { area: "Matemática",           topic: "Revisão final: Geometria e conversão de unidades" },
    ter:  { area: "Linguagens · Port",    topic: "Revisão final: Literatura (barroco, árcade, africana, pernambucana e popular)" },
    qua:  { area: "Matemática",           topic: "Revisão final: Equações e sistemas + exercícios" },
    qui:  { area: "Geografia",            topic: "Biosfera: biomas, formações vegetais, fatores de distribuição e impactos" },
    sex:  { area: "Biologia",             topic: "Mudanças climáticas, espécies exóticas; desenvolvimento sustentável e biodiversidade" },
    sab1: { area: "Matemática",           topic: "Reforço nos erros do simulado final" },
    sab2: { area: "Linguagens · Arte",    topic: "Arte híbrida; arte moderna e contemporânea no Brasil e em Pernambuco; arte popular" },
    dom1: { area: "Química",              topic: "Polímeros: propriedades, usos e impacto ambiental" },
    dom2: { area: "Filosofia",            topic: "Filosofia contemporânea: mídias, cidadania, fake news; trabalho, ideologia e alienação" },
  },
  23: {
    seg:  { area: "Matemática",           topic: "Simulado geral — Matemática (prova completa)" },
    ter:  { area: "Linguagens · Port",    topic: "Simulado geral — Linguagens (Português, Inglês, Espanhol)" },
    qua:  { area: "Ciências da Natureza", topic: "Simulado geral — Ciências da Natureza" },
    qui:  { area: "Ciências Humanas",     topic: "Simulado geral — Ciências Humanas" },
    sex:  { area: "Revisão",              topic: "Correção de todos os simulados + lista de dúvidas finais" },
    sab1: { area: "Matemática",           topic: "Reforço final nos erros dos simulados — Matemática" },
    sab2: { area: "Linguagens · EF",      topic: "Ginástica: histórico, condicionamento físico, artística e rítmica; anabolizantes e saúde" },
    dom1: { area: "Química",              topic: "Química e a vida: fármacos, hormônios, drogas, mediadores químicos (dopamina, serotonina, endorfina)" },
    dom2: { area: "Filosofia",            topic: "Neoliberalismo, globalização; ciência, tecnologia e mundo do trabalho; identidade e ancestralidade" },
  },
  24: {
    seg:  { area: "Revisão",              topic: "Revisão final: Matemática — pontos mais cobrados no SSA" },
    ter:  { area: "Revisão",              topic: "Revisão final: Linguagens — leitura, gramática e literatura" },
    qua:  { area: "Revisão",              topic: "Revisão final: Ciências da Natureza — Bio, Química e Física" },
    qui:  { area: "Revisão",              topic: "Revisão final: Ciências Humanas — História, Geografia e Filosofia" },
    sex:  { area: "Revisão",              topic: "Revisão rápida de anotações pessoais + descanso mental" },
    sab1: { area: "Matemática",           topic: "Últimos exercícios: foco nos tópicos mais cobrados no SSA" },
    sab2: { area: "Linguagens · EF",      topic: "Esportes de marca e invasão; práticas corporais de aventura urbana; jogos de salão e xadrez" },
    dom1: { area: "Física",               topic: "Quantidade de movimento; conservação do momento; impulso e choques mecânicos" },
    dom2: { area: "Revisão",              topic: "Descanso total — cuide do sono, alimentação e respiração 🎯" },
  },
};

const areaColors = {
  "Matemática":            { bg: "#FDF3E7", text: "#C0732A", dot: "#E08A2F" },
  "Linguagens · Port":     { bg: "#EBF3FB", text: "#2A5F96", dot: "#4F86C6" },
  "Linguagens · Inglês":   { bg: "#E8F0FD", text: "#1D4E8F", dot: "#3B7DD8" },
  "Linguagens · Espanhol": { bg: "#EDF5FF", text: "#1A5C99", dot: "#2E86C1" },
  "Linguagens · Arte":     { bg: "#F0E8FA", text: "#6B2D9E", dot: "#9B59B6" },
  "Linguagens · EF":       { bg: "#E8F8F5", text: "#1A6645", dot: "#27AE60" },
  "Biologia":              { bg: "#EBF7EF", text: "#2E7A4A", dot: "#5BAD72" },
  "Química":               { bg: "#E8F6F0", text: "#1A7A54", dot: "#2ECC71" },
  "Física":                { bg: "#E9F7E9", text: "#1D6B2E", dot: "#3CB371" },
  "Ciências da Natureza":  { bg: "#EBF7EF", text: "#2E7A4A", dot: "#5BAD72" },
  "História":              { bg: "#F3EBFB", text: "#6A3BAA", dot: "#9B6DD6" },
  "Geografia":             { bg: "#EEE8FA", text: "#5C2E9E", dot: "#8E44AD" },
  "Filosofia":             { bg: "#F9EBF9", text: "#8B2E8B", dot: "#C039C0" },
  "Ciências Humanas":      { bg: "#F3EBFB", text: "#6A3BAA", dot: "#9B6DD6" },
  "Revisão":               { bg: "#F5F5F5", text: "#555",    dot: "#999"    },
};

const weekdaySlots = [
  { key: "seg",  label: "Seg",  weekend: false },
  { key: "ter",  label: "Ter",  weekend: false },
  { key: "qua",  label: "Qua",  weekend: false },
  { key: "qui",  label: "Qui",  weekend: false },
  { key: "sex",  label: "Sex",  weekend: false },
];
const weekendSlots = [
  { key: "sab1", label: "Sáb ☀", weekend: true, sub: "manhã" },
  { key: "sab2", label: "Sáb 🌤", weekend: true, sub: "tarde" },
  { key: "dom1", label: "Dom ☀", weekend: true, sub: "manhã" },
  { key: "dom2", label: "Dom 🌤", weekend: true, sub: "tarde" },
];
const allSlots = [...weekdaySlots, ...weekendSlots];

const SESSIONS_PER_WEEK = 9; // 5 dias úteis + 4 sessões de fim de semana
const TOTAL_SESSIONS = TOTAL_WEEKS * SESSIONS_PER_WEEK;

const tips = [
  "Use a técnica Pomodoro: 25 min de estudo, 5 min de pausa.",
  "Em Matemática, faça pelo menos 5 exercícios por tópico estudado.",
  "Ao errar uma questão, anote o motivo do erro — não apenas a correção.",
  "Leia um texto argumentativo por semana para treinar interpretação.",
  "Em Física e Química, sempre relacione a fórmula a uma situação real.",
  "Use mapas mentais para revisar Biologia e Ciências Humanas.",
  "Resolva provas antigas do SSA para se familiarizar com o estilo das questões.",
  "Nos fins de semana, aproveite as 2 sessões para variar as áreas e não enjoar.",
  "Ao estudar Literatura, leia trechos originais — ajuda muito na interpretação.",
];

export default function PlanoEstudos() {
  const [selectedPhase, setSelectedPhase] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [completedDays, setCompletedDays] = useState({});
  const [tipIndex] = useState(Math.floor(Math.random() * tips.length));
  const [showWeekend, setShowWeekend] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  // Carrega o progresso salvo ao abrir
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ssa1-progresso");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.completedDays) setCompletedDays(data.completedDays);
        if (data.selectedPhase) setSelectedPhase(data.selectedPhase);
        if (data.selectedWeek) setSelectedWeek(data.selectedWeek);
      }
    } catch (e) {}
    setLoaded(true);
  }, []);

  // Salva o progresso sempre que algo muda
  useEffect(() => {
    if (!loaded) return;
    try {
      setSaving(true);
      localStorage.setItem("ssa1-progresso", JSON.stringify({
        completedDays,
        selectedPhase,
        selectedWeek,
      }));
      setTimeout(() => setSaving(false), 800);
    } catch (e) {}
  }, [completedDays, selectedPhase, selectedWeek, loaded]);

  const phase = phases.find((p) => p.id === selectedPhase);
  const weeksInPhase = Array.from(
    { length: phase.weekRange[1] - phase.weekRange[0] + 1 },
    (_, i) => phase.weekRange[0] + i
  );

  const weekData = schedule[selectedWeek] || {};

  const toggle = (week, key) => {
    const k = `${week}-${key}`;
    setCompletedDays((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const progress = Math.round((completedCount / TOTAL_SESSIONS) * 100);

  const visibleSlots = showWeekend ? weekendSlots : weekdaySlots;

  const weekCompleted = (w) => allSlots.filter((s) => completedDays[`${w}-${s.key}`]).length;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#F7F8FA", minHeight: "100vh", paddingBottom: 48 }}>

      {/* Header */}
      <div style={{ background: "#1A2340", padding: "28px 24px 20px", color: "#fff" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#7BA7E0", textTransform: "uppercase", marginBottom: 6 }}>
            Plano de Estudos — Cobertura Total
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>SSA 1 · 2026</h1>
            {saving && (
              <span style={{ fontSize: 11, color: "#5BAD72", fontWeight: 700, background: "#1D3A2A", padding: "4px 10px", borderRadius: 99 }}>
                ✓ salvo
              </span>
            )}
          </div>
          <p style={{ margin: "6px 0 0", color: "#A8BFDA", fontSize: 14 }}>
            24 semanas · 187 tópicos · 9 sessões/semana · Seg–Dom
          </p>
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#7BA7E0", marginBottom: 6 }}>
              <span>Progresso geral</span>
              <span>{completedCount}/{TOTAL_SESSIONS} sessões · {progress}%</span>
            </div>
            <div style={{ background: "#2E3D5E", borderRadius: 99, height: 8, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg, #4F86C6, #5BAD72)", width: `${progress}%`, height: "100%", borderRadius: 99, transition: "width 0.4s" }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 16px" }}>

        {/* Tip */}
        <div style={{ background: "#FFFBEB", border: "1px solid #F5D87A", borderRadius: 10, padding: "12px 16px", marginTop: 20, fontSize: 13, color: "#7A5C00", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18 }}>💡</span>
          <span><strong>Dica:</strong> {tips[tipIndex]}</span>
        </div>

        {/* Phases */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Fases</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {phases.map((p) => (
              <button key={p.id}
                onClick={() => { setSelectedPhase(p.id); setSelectedWeek(p.weekRange[0]); }}
                style={{ border: selectedPhase === p.id ? `2px solid ${p.color}` : "2px solid transparent", background: selectedPhase === p.id ? p.bg : "#fff", borderRadius: 12, padding: "14px 16px", textAlign: "left", cursor: "pointer", boxShadow: selectedPhase === p.id ? `0 0 0 1px ${p.color}22` : "0 1px 4px #0001", transition: "all 0.2s" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: 1 }}>{p.label}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1A2340", marginTop: 2 }}>{p.subtitle}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{p.weeks}</div>
              </button>
            ))}
          </div>
          <div style={{ background: phase.bg, border: `1px solid ${phase.color}33`, borderRadius: 10, padding: "10px 14px", marginTop: 10, fontSize: 13, color: phase.color, fontWeight: 600 }}>
            {phase.description}
          </div>
        </div>

        {/* Week selector */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Semana</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {weeksInPhase.map((w) => {
              const done = weekCompleted(w);
              const allDone = done === SESSIONS_PER_WEEK;
              return (
                <button key={w} onClick={() => setSelectedWeek(w)}
                  style={{ minWidth: 52, padding: "8px 10px", borderRadius: 10, border: selectedWeek === w ? `2px solid ${phase.color}` : "2px solid #E5E7EB", background: allDone ? phase.color : selectedWeek === w ? phase.bg : "#fff", color: allDone ? "#fff" : selectedWeek === w ? phase.color : "#333", fontWeight: 700, fontSize: 13, cursor: "pointer", position: "relative", transition: "all 0.15s" }}>
                  S{w}
                  {done > 0 && !allDone && (
                    <span style={{ position: "absolute", top: -4, right: -4, background: phase.color, color: "#fff", borderRadius: 99, fontSize: 9, width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>{done}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day toggle */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: 2, textTransform: "uppercase" }}>
              Semana {selectedWeek} — {showWeekend ? "Fim de Semana" : "Dias Úteis"}
            </div>
            <button onClick={() => setShowWeekend(!showWeekend)}
              style={{ background: showWeekend ? "#1A2340" : "#EBF3FB", color: showWeekend ? "#fff" : "#2A5F96", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
              {showWeekend ? "← Dias úteis" : "Fim de semana →"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {visibleSlots.map(({ key, label, weekend, sub }) => {
              const item = weekData[key];
              if (!item) return null;
              const ac = areaColors[item.area] || areaColors["Revisão"];
              const doneKey = `${selectedWeek}-${key}`;
              const done = completedDays[doneKey];
              return (
                <div key={key}
                  style={{ background: done ? "#F0FDF4" : weekend ? "#FAFBFF" : "#fff", border: done ? "1px solid #86EFAC" : weekend ? "1px dashed #C7D2E8" : "1px solid #E5E7EB", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s" }}>
                  <div style={{ width: 44, textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: weekend ? "#7BA7E0" : "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                    {sub && <div style={{ fontSize: 9, color: "#B0C4DE", marginTop: 1 }}>{sub}</div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "inline-block", background: ac.bg, color: ac.text, borderRadius: 99, fontSize: 11, fontWeight: 700, padding: "2px 10px", marginBottom: 4 }}>
                      <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: ac.dot, marginRight: 5, verticalAlign: "middle" }} />
                      {item.area}
                    </span>
                    <div style={{ fontSize: 13, fontWeight: 600, color: done ? "#15803D" : "#1A2340", textDecoration: done ? "line-through" : "none", lineHeight: 1.4 }}>{item.topic}</div>
                  </div>
                  <button onClick={() => toggle(selectedWeek, key)}
                    style={{ width: 28, height: 28, borderRadius: 8, border: done ? "none" : "2px solid #D1D5DB", background: done ? "#22C55E" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", flexShrink: 0, transition: "all 0.15s" }}>
                    {done ? "✓" : ""}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coverage legend */}
        <div style={{ marginTop: 28, background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Distribuição por dia</div>
          {[
            { day: "Segunda",          area: "Matemática",          detail: "1 tópico novo" },
            { day: "Terça",            area: "Linguagens",          detail: "Port. / Inglês / Espanhol (alternando)" },
            { day: "Quarta",           area: "Matemática",          detail: "1 tópico novo" },
            { day: "Quinta",           area: "Ciências Humanas",    detail: "História / Geografia / Filosofia" },
            { day: "Sexta",            area: "Ciências da Natureza",detail: "Biologia / Química / Física" },
            { day: "Sábado manhã",     area: "Matemática",          detail: "Exercícios e simulados (3–4h)" },
            { day: "Sábado tarde",     area: "Linguagens",          detail: "Arte / Ed. Física / Inglês / Espanhol extras" },
            { day: "Domingo manhã",    area: "Ciências da Natureza",detail: "Tópico extra de Bio / Química / Física" },
            { day: "Domingo tarde",    area: "Revisão / Filosofia", detail: "Revisão cruzada ou Filosofia" },
          ].map(({ day, area, detail }) => {
            const ac = areaColors[area] || areaColors["Revisão"];
            return (
              <div key={day} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: ac.dot, marginTop: 5, flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#1A2340" }}>{day}</span>
                  <span style={{ fontSize: 12, color: "#777", marginLeft: 8 }}>{area}</span>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{detail}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 12, background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#166534" }}>
          ✅ <strong>187 tópicos cobertos</strong> ao longo das 24 semanas — todas as disciplinas do edital do SSA 1 estão representadas.
        </div>

      </div>
    </div>
  );
}
