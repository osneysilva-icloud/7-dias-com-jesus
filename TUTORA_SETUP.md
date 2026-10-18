# ✝ 7 Dias com Jesus — Guia de Integração com a Tutora

Este guia ensina o passo a passo exato para cadastrar o produto na **Tutora** (plataforma de pagamento e infoprodutos em Moçambique com M-Pesa e E-Mola) e colocar seu funil para rodar e converter.

---

## 1. Como Cadastrar o Produto na Tutora

1. Acesse o portal da [Tutora](https://tutora.co.mz/) e entre no seu painel de criador/produtor.
2. Clique em **Criar Novo Produto**.
3. Preencha as informações do produto:
   - **Nome do Produto**: `7 Dias com Jesus — A Jornada Digital`
   - **Formato**: Produto Digital / SaaS / Acesso Web
   - **Preço**: `197 MT` (Meticais)
   - **Tipo de Cobrança**:
     - *Opção A (Recomendada para começar)*: **Pagamento Único** de 197 MT com acesso vitalício.
     - *Opção B (Modelo SaaS)*: **Assinatura Recorrente** (ex: 197 MT/mês ou 99 MT/semana).
   - **Garantia**: 7 dias.
   - **Página de Vendas / URL**: O link do seu site (ex: `https://seusite.com/index.html`).
   - **URL de Entrega / Obrigado**: O link do Web App (`https://seusite.com/app.html`).
4. Conclua o cadastro e copie o **Link de Checkout Oficial** gerado pela Tutora (ex: `https://tutora.co.mz/checkout/xxxxxx`).

---

## 2. Como Configurar o Link no Seu Projeto

Abra o arquivo [`config.js`](file:///c:/Users/Administrator/OneDrive/Documentos/7%20Dias%20com%20Jesus/config.js) no seu editor e altere a seguinte linha:

```javascript
tutoraCheckoutUrl: "COLE_AQUI_O_SEU_LINK_DE_CHECKOUT_DA_TUTORA",
```

Também pode atualizar o seu número de WhatsApp de suporte para que os clientes tirem dúvidas diretamente com você:

```javascript
support: {
  whatsappNumber: "25884XXXXXXX", // Seu número de Moçambique
  whatsappMessage: "Olá! Gostaria de tirar dúvidas sobre o programa 7 Dias com Jesus.",
  email: "seuemail@exemplo.com"
}
```

---

## 3. Como os Clientes Recebem o Acesso após Pagar com M-Pesa / E-Mola

Na Tutora, quando o cliente escolhe pagar via M-Pesa ou E-Mola:
1. Ele digita o número de telefone no checkout.
2. Recebe a mensagem 'push' no telemóvel para inserir o código PIN de confirmação.
3. Assim que confirmado, a Tutora envia a confirmação automática por SMS/Email com o link de acesso: `https://seusite.com/app.html`.
4. O cliente abre `app.html` no telemóvel e já tem acesso imediato aos 7 dias, devocionais, áudios com harpa e orações!

---

## 4. Como Colocar o Site no Ar (Hospedagem Gratuita)

Você pode hospedar este projeto gratuitamente e com SSL (cadeado verde) em menos de 3 minutos em qualquer um destes serviços:

### Opção 1: Vercel (Recomendado)
1. Crie uma conta gratuita em [vercel.com](https://vercel.com).
2. Arraste a pasta do projeto ou conecte com o GitHub.
3. O Vercel fará a publicação instantânea com um link rápido e seguro.

### Opção 2: Netlify
1. Crie uma conta em [netlify.com](https://netlify.com).
2. Vá em **Sites** > arraste a pasta inteira `7 Dias com Jesus` para dentro do navegador.
3. O site estará online no mesmo segundo.

---

## 5. Estratégia de Tráfego de Alta Conversão

- **Anúncio no Facebook/Instagram (Meta Ads)** focado em Moçambique (Maputo, Matola, Beira, Nampula, Tete, etc.):
  - *Criativo*: Imagem ou vídeo curto bíblico com música inspiradora.
  - *Chamada*: "Assista gratuitamente à história real de Jesus Cristo e descubra a mensagem de paz para a sua família hoje."
  - *Público*: Homens e mulheres de 24 a 65+ anos com interesse em Cristianismo, Fé, Esperança, Bíblia.
  - *Funil*: O visitante chega na página inicial (`index.html`), assiste ao vídeo gratuito do Vidalytics (isca) e se encanta com a proposta de continuar a caminhada por 7 dias por apenas 197 MT pagos via M-Pesa.
