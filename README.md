# 4D Hotelaria e Turismo — landing page

Landing page da **4D Hotelaria e Turismo**, a frente da 4D dedicada a hotéis, pousadas, resorts e agências. O objetivo da página é captar empresas do setor com o formulário de diagnóstico gratuito.

> **Endereço local:** http://localhost:5190 · **Comando:** `npm run dev`

---

## Qual código o site usa

| Linguagem / ferramenta | Para quê | Onde fica |
|---|---|---|
| **HTML** | estrutura e textos das páginas | `site/*.html` |
| **CSS** | visual: cores, fontes, layout, animações, versão para celular | `site/assets/css/style.css` |
| **JavaScript** | interações: menu, animações ao rolar, painel do elevador, CTA fixo, formulário, aviso de cookies | `site/assets/js/` |
| **Node.js + Vite** | só na máquina de quem desenvolve: roda o `localhost` e gera a versão final otimizada | `package.json`, `vite.config.js` |

Não usa React, WordPress nem Elementor. O resultado final é um site estático (HTML + CSS + JS) que funciona em qualquer hospedagem.

---

## Estrutura de pastas

```
4D Hotelaria e Turismo [4D]/
│
├── site/                           ← CÓDIGO DO SITE (tudo o que vira a página)
│   ├── index.html                  página principal
│   ├── obrigado.html               página de obrigado (depois do formulário)
│   ├── politica-de-privacidade.html
│   ├── politica-de-cookies.html
│   ├── assets/
│   │   ├── css/style.css           visual (cores e fontes no topo, em :root)
│   │   ├── js/config.js            ⚙️ CONFIGURAÇÕES: WhatsApp e formulário
│   │   ├── js/main.js              interações da página principal
│   │   ├── js/cookies.js           aviso de cookies
│   │   ├── js/obrigado.js          script da página de obrigado
│   │   ├── js/paginas.js           script das páginas de política
│   │   └── img/                    imagens do site (.webp), ícone e favicon
│   └── public/                     arquivos copiados como estão (ex.: vídeos)
│
├── _materiais/                     ← MATERIAIS DE APOIO (não vão para o site)
│   ├── logos/                      logos da 4D em alta
│   ├── imagens/
│   │   ├── geradas-ia/             originais em alta das imagens do site (Higgsfield)
│   │   └── fotos-reais/            coloque aqui fotos reais de clientes e eventos
│   ├── videos/                     vídeos brutos
│   └── briefing/                   copy aprovada da página
│
├── scripts/empacotar.mjs           gera o .zip de publicação
├── .vscode/                        atalhos (tarefas) do Antigravity/VS Code
├── package.json                    comandos do projeto e dependências
├── vite.config.js                  servidor local (porta 5190) e build
├── .nvmrc                          versão do Node (22)
├── .editorconfig                   padrão de formatação do código
│
├── node_modules/                   (gerada pelo npm install; não mexer, não enviar)
└── dist/                           (gerada pelo npm run build; é o que vai para a hospedagem)
```

---

## 1. Instalar (uma vez só por computador)

1. Instale o **Node.js 22 LTS**: https://nodejs.org → botão "LTS".
2. Abra esta pasta (`4D Hotelaria e Turismo [4D]`) no **Antigravity** ou no VS Code: *File → Open Folder*.
3. Abra o terminal integrado (`Ctrl + '`) e rode:

```bash
npm install
```

## 2. Rodar o site (localhost)

```bash
npm run dev
```

O navegador abre em **http://localhost:5190**. A página se atualiza sozinha a cada arquivo salvo. Para parar o servidor, use `Ctrl + C` no terminal.

**Sem terminal:** `Ctrl + Shift + P` → *Tasks: Run Task* → **▶ Rodar site (localhost:5190)**.

### Portas: cada projeto tem a sua

| Projeto | Porta |
|---|---|
| 4D Eventos | 5173 |
| X3 | 4173 |
| Projetos de vídeo (Remotion) | 3000 |
| 4D Travel | 5180 (build: 4180) |
| **4D Hotelaria e Turismo** | **5190** (conferência do build: **4190**) |

A porta é fixa (`strictPort`). Se aparecer o erro *"Port 5190 is already in use"*, o site já está rodando em outro terminal: use essa aba ou feche-a antes. Para mudar a porta, edite `server.port` no `vite.config.js`.

## 3. Antes de publicar: configurações

Tudo fica em **[`site/assets/js/config.js`](site/assets/js/config.js)**:

| Campo | O que colocar | Situação |
|---|---|---|
| `whatsapp` | número com DDI + DDD, só números (ex.: `5531999998888`) | ⚠️ provisório |
| `whatsappMessage` | mensagem que já vem escrita no WhatsApp | ✅ |
| `formEndpoint` | URL que recebe os dados do formulário (ver seção 5) | ⚠️ vazio = modo demonstração, não envia os dados |
| `thankYouPage` | página exibida após o envio | ✅ `obrigado.html` |

## 4. Gerar a versão final e publicar

```bash
npm run build     # gera a versão final na pasta dist/
npm run preview   # confere a versão final em http://localhost:4190
npm run entrega   # faz o build e cria 4d-hotelaria-turismo-publicar.zip
```

**Publicar = enviar o conteúdo da pasta `dist/`** (ou do `.zip`) para a pasta pública da hospedagem, por exemplo `public_html/hotelaria/`, o que resulta em `https://4dimensoes.com/hotelaria/`. Como os caminhos são relativos, o site funciona na raiz, numa subpasta ou num subdomínio.
Na Netlify, na Vercel ou no Cloudflare Pages: comando de build `npm run build` e pasta `dist`.

## 5. Formulário: para onde vão os dados

Com `formEndpoint` vazio, o formulário valida os campos e leva à página de obrigado, **sem enviar os dados**. Para receber os pedidos, informe uma URL que aceite `POST` com `FormData`:

- **Contact Form 7 (WordPress):** `https://4dimensoes.com/wp-json/contact-form-7/v1/contact-forms/ID/feedback`. Crie o formulário no CF7 com os mesmos `name` da tabela abaixo. A partir da versão 5.8, o CF7 também exige um campo oculto `_wpcf7_unit_tag`.
- **Webhook de CRM** (RD Station, HubSpot, Make, Zapier…) ou **Formspree**.

| Campo | name | Obrigatório |
|---|---|---|
| Nome | `your-name` | sim |
| Hotel/Pousada/Agência | `your-company` | sim |
| E-mail | `your-email` | sim |
| WhatsApp | `your-phone` | sim |
| Cidade/UF | `your-city` | sim |
| Site | `your-site` | não |
| Investimento mensal em marketing | `your-investment` | sim |
| Objetivo principal | `your-goal` | não |
| Aceite LGPD | `acceptance-lgpd` | sim |

## 6. Sequência das seções (segue o briefing, não alterar)

Hero + dores → Solução → Sobre → Validação (prova social) → Formulário → FAQ → CTA final → página de obrigado.
O CTA principal ("Quero aumentar minhas reservas") fica **fixo no rodapé do celular** depois que o hero sai da tela e some quando o formulário aparece.
A copy aprovada está em [`_materiais/briefing/`](_materiais/briefing/briefing-4d-hotelaria-turismo.md).

## 7. Identidade visual

- **Base:** a mesma da 4D Eventos e da 4D Travel (tokens, fontes, botões), para as LPs deste cliente serem da mesma família.
- **Cores:** azul 4D `#003fff`, noite `#050818`, linho `#f4f1ea` e latão `#f2c572` (detalhes). Ficam no topo do `style.css`.
- **Fontes:** Archivo e JetBrains Mono (Google Fonts).
- **Conceito:** "a recepção do hotel" — plaquinhas de porta nas dores, andares com painel de elevador nas entregas, cartão-chave no Sobre e na página de obrigado, painel de reservas na prova social.

## 8. Passar o projeto para outra pessoa

Compacte a pasta `4D Hotelaria e Turismo [4D]` **sem** `node_modules/` e `dist/`. Quem receber abre a pasta no editor, roda `npm install` e depois `npm run dev`.

## 9. Pendências antes de ir ao ar

- [ ] Número oficial do WhatsApp (`config.js`)
- [ ] `formEndpoint` configurado e testado
- [ ] Validar os números do **painel ilustrativo** (hero e prova social). Estão marcados como "ilustrativo"; se houver um case real com números autorizados, trocar por eles
- [ ] Trocar a foto de IA do evento por uma foto real da **Convenção CREDFRANCO (2024)**, se houver
- [ ] Confirmar o endereço final (subpasta ou subdomínio)
- [ ] Google Tag Manager / Meta Pixel no `<head>` das páginas, se for usar
