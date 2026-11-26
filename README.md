# Jimin-ssi — K-pop Store & Drinks

Site demonstrativo da loja Jimin-ssi (Caxias-MA), alinhado ao Plano de Marketing Digital e Negócios Online:
loja de K-pop (BTS, BLACKPINK, TWICE, STRAY KIDS, TXT, ATEEZ, MAMAMOO) com área complementar de drinks e comidas coreanas.

O que o site cobre do plano:

| Plano | No site |
|---|---|
| 3.1 Site de vendas com catálogo por categorias, imagens, descrições, preços, disponibilidade, pagamento e entrega | Categorias + filtros por grupo e faixa de preço (até R$ 50, R$ 50–150, colecionador), selos "Em estoque / Últimas unidades / Pré-venda", quick view com pagamento (Pix, cartão) e retirada na loja |
| 3.2 Instagram como canal principal | Seção "No Instagram" e link do perfil (defina `INSTAGRAM` em `src/main.ts`) |
| 3.3 Campanhas: combos, ofertas, quantidade limitada | Seção "Combos com desconto" (`combos` em `src/data.ts`) |
| 3.4 Conversão | Carrinho com barra de frete grátis, preços visíveis, compra em poucos cliques |
| 3.5 Fidelização: cupons, clientes recorrentes | Cupons `BEMVINDO10` (newsletter) e `FIDELIDADE15` (`coupons` em `src/data.ts`) |
| 5.1 WhatsApp Business | Botão flutuante (defina `WHATS` em `src/main.ts`) |
| 4 e 3.6 Indicadores para decisão (SIG) | Painel de indicadores (rodapé → "Painel de indicadores (demo)"): visitas, taxa de conversão, pedidos e receita, desistência no checkout, adições por visita, cupons, mais vistos, mais adicionados e filtros mais usados. `src/analytics.ts` também envia os eventos ao Google Analytics 4 (`view_item`, `add_to_cart`, `begin_checkout`, `purchase`) quando o snippet do `gtag` estiver na página |

Na demonstração os indicadores ficam só no navegador de quem usa e o checkout é simulado; em produção, o pedido só conta como venda quando o pagamento for confirmado pelo servidor, e os cupons também devem ser validados no servidor.

## Rodar em outro computador

**Precisa ter:**

1. **Node.js 20 ou mais novo** (a versão LTS de nodejs.org). O `npm` já vem junto.
2. **Internet**, porque o site busca as fontes no Google Fonts e os mapas no OpenFreeMap, e a primeira instalação baixa os pacotes do npm. Sem internet o site abre, mas sem as fontes certas e sem o mapa.
3. **A pasta do projeto, sem `node_modules/` e `dist/`** (são recriadas). O essencial é `index.html`, `package.json`, `package-lock.json` (garante as mesmas versões), `tsconfig.json`, `src/` e `public/`.

**Como rodar** (no terminal, dentro da pasta):

```bash
npm ci --ignore-scripts   # instala exatamente as versões do package-lock.json, sem rodar scripts de pacotes
npm run dev               # abre em http://localhost:5173
```

Outros comandos:

```bash
npm run build      # checa os tipos (tsc) e gera o site pronto em dist/
npm run preview    # serve o dist/ para conferir
```

**Opcional:** Python com [uv](https://docs.astral.sh/uv/) só para gerar as imagens de novo (recortes, banners e miniaturas dos grupos, intro). As imagens prontas já estão em `public/`. `assets-src/` guarda as fotos originais e também só serve para isso.

**Mostrar sem instalar nada:** rode `npm run build` e hospede a pasta `dist/` em qualquer servidor de arquivos estáticos (Vercel, Netlify, GitHub Pages). Abrir o `dist/index.html` com dois cliques não funciona: o navegador bloqueia os módulos e o mapa quando a página vem direto do disco.

## Stack

- Vite 6 + TypeScript (estrito), sem framework.
- GSAP 3.13 + ScrollTrigger: intro, palavras do hero, parallax por camada, reveal em lote, cardápio horizontal com pin (só desktop), contadores, carrinho e quick view.
- Canvas próprio (`src/fx.ts`) para corações e brilhos, com pool fixo, DPR ≤ 2, pausa fora de foco e respeito a `prefers-reduced-motion` (checklist AN-08 do acervo).

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Marcação de todas as seções |
| `src/data.ts` | Produtos, categorias e opções do Drink Lab (**troque preços e nomes reais aqui**) |
| `src/store.ts` | Carrinho e favoritos com `localStorage` |
| `src/main.ts` | Interações e animações |
| `src/fx.ts` | Partículas em canvas |
| `src/styles.css` | Tokens de cor (rosa/laranja + tema roxo Borahae) e layout |
| `assets-src/` | Imagens originais geradas na Higgsfield (Z Image) e os prompts (`prompts.tsv`) |
| `tools/otimizar_imagens.py` | Converte `assets-src/*.png` em `public/img/*.webp` e monta `tools/contato.jpg` |
| `tools/intro_animacao.py` | Desenha a explosão de corações da intro quadro a quadro (WebP animado) e o favicon |

Regerar as imagens e a intro: `uv run --with pillow python tools/otimizar_imagens.py` e `uv run --with pillow python tools/intro_animacao.py`.

## Antes de publicar

- Seis produtos já usam foto real (capas de álbum e o lightstick BLACKPINK × Murakami; veja `CREDITOS.md`). Os outros, os drinks e as comidas ainda usam imagens **ilustrativas** (IA): as pastas `assets-src/produtos/<id>/` esperam as fotos reais. Não use rosto de pessoa real gerado por IA.
- Logo oficial do BTS e fotos dos membros pertencem aos titulares: use só material licenciado.
- Checkout, newsletter, WhatsApp e links institucionais são de demonstração: falta integrar pagamento (ex.: Mercado Pago), e-mail e páginas de política.
- O contador "24h para despachar" é ilustrativo: ajuste para o prazo real.
