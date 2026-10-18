# ✝ 7 Dias com Jesus — App SaaS & Funil de Alta Conversão

Um aplicativo web e funil de alta conversão estruturado para transformar a curiosidade despertada pelo vídeo gratuito ("A História Real de Jesus Cristo") em uma experiência digital guiada de 7 dias, monetizada pela **Tutora** (com M-Pesa, E-Mola, Cartão de Crédito e Transferência).

---

## 📁 Estrutura do Projeto

```text
├── index.html         # Landing Page de Alta Conversão com VSL (Vidalytics) + Oferta 197 MT
├── app.html           # Web App PWA / Área de Membros dos 7 Dias com Jesus
├── config.js          # Configuração central (Link da Tutora, preços, suporte, dados dos 7 dias)
├── server.js          # Servidor Node.js nativo para testes locais
├── TUTORA_SETUP.md    # Guia passo a passo de cadastro e checkout na Tutora
├── package.json       # Configurações do pacote
└── README.md          # Documentação principal
```

---

## 🌟 Principais Recursos

### 1. Landing Page de Alta Conversão (`index.html`)
- **Vídeo Isca Integrado**: Embed oficial do Vidalytics (`cy2KArFNcYtVMeev`) pronto para retenção.
- **Transição Fluida para a Oferta**: Pitch "A história de Jesus não termina aqui" posicionado logo abaixo do vídeo gratuito.
- **Apresentação dos 7 Dias**: Módulos detalhados (Nascimento, Mensagem, Milagres, Última Ceia, Crucificação, Ressurreição e Legado).
- **Prova Social Regionalizada**: Depoimentos reais focados em Moçambique (Maputo, Beira, Nampula).
- **Checkout Integrado Tutora**: Moeda oficial de Moçambique (`197 MT`), destacando suporte nativo a M-Pesa e E-Mola.
- **Bônus de Alto Valor Percebido**: Orações para momentos difíceis, áudios de meditação para dormir e Certificado Digital.
- **Garantia Blindada**: 7 dias de satisfação ou reembolso total.

### 2. Área de Membros / Web App SaaS (`app.html`)
- **Experiência Mobile-First**: Visual limpo, escuro e reverente com fontes *Cinzel* e *Outfit*.
- **Harpa Celestial em Tempo Real**: Áudio relaxante de cura espiritual sintetizado via Web Audio API (sem travamentos e sem depender de arquivos pesados).
- **Narração Guiada em Áudio**: O usuário pode escutar a leitura da reflexão do dia com apenas 1 clique.
- **Passagens Bíblicas com Cópia Rápida**: Facilidade para copiar versículos e compartilhar no WhatsApp.
- **Diário de Fé Pessoal**: Espaço interativo para o usuário responder à pergunta do dia, com salvamento local no dispositivo (`localStorage`).
- **Sistema de Conclusão e Certificado Sagrado**: Barra de progresso interativa e liberação de Certificado Oficial com efeito de confete ao concluir o 7º dia.

---

## 🚀 Como Executar Localmente

Se desejar visualizar e testar o projeto no seu computador:

```bash
npm start
```

Ou diretamente com o Node:

```bash
node server.js
```

Abra no seu navegador:
- **Página de Vendas**: [http://localhost:3000/index.html](http://localhost:3000/index.html)
- **Área de Membros / App**: [http://localhost:3000/app.html](http://localhost:3000/app.html)

---

## ⚙️ Personalização

Para alterar o link de checkout da Tutora, preços ou contatos, basta editar o arquivo [`config.js`](file:///c:/Users/Administrator/OneDrive/Documentos/7%20Dias%20com%20Jesus/config.js).
