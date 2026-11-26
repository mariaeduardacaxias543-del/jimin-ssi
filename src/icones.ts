// Ícones próprios da Jimin-ssi (no lugar de emojis): grade de 32 px, traço arredondado de 2 px na cor do texto
// e um detalhe de destaque (coração, brilho ou bolinha) em --ico-a, que segue a paleta do tema.
// Viram um sprite SVG inserido uma vez no <body>; o HTML e o TS usam <svg><use href="#i-nome"/></svg>.

// Coração base em 10×9,2 e brilho base em 10×10; posicionados com translate/scale nos ícones (só em formas sem traço).
const CORACAO = 'M5 9.2C2.2 7.4 0 5.6 0 3.2A2.6 2.6 0 0 1 5 2a2.6 2.6 0 0 1 5 1.2c0 2.4-2.2 4.2-5 6z';
const BRILHO = 'M5 0C5.6 3.4 6.6 4.4 10 5C6.6 5.6 5.6 6.6 5 10C4.4 6.6 3.4 5.6 0 5C3.4 4.4 4.4 3.4 5 0z';
const A = 'style="fill:var(--ico-a);stroke:none"';
const coracao = (x: number, y: number, s = 1) => `<path ${A} transform="translate(${x} ${y}) scale(${s})" d="${CORACAO}"/>`;
const brilho = (x: number, y: number, s = 1) => `<path ${A} transform="translate(${x} ${y}) scale(${s})" d="${BRILHO}"/>`;

const icones = {
  // categorias
  tudo: `<rect x="5" y="5" width="9" height="9" rx="2.5"/><rect x="18" y="5" width="9" height="9" rx="2.5"/><rect x="5" y="18" width="9" height="9" rx="2.5"/>${brilho(17.5, 17.5)}`,
  album: `<circle cx="16" cy="16" r="11.5"/><path d="M8.6 12.4a8 8 0 0 1 4.2-4.1"/>${coracao(12.5, 12.4, 0.7)}`,
  photocard: `<path d="M6.5 8v17a3 3 0 0 0 3 3h11"/><rect x="10" y="3.5" width="16" height="21.5" rx="3"/>${coracao(13, 8.5)}<path d="M14 20.5h8"/>`,
  lightstick: `<circle cx="16" cy="10.5" r="7.5"/><path d="M12.5 18.5h7M14 18.5v8.5a2 2 0 0 0 4 0v-8.5M4 10.5h2M26 10.5h2M6.5 3.5l1.5 1.5M25.5 3.5 24 5"/>${coracao(13, 8, 0.6)}`,
  poster: `<path d="M11 6.5 16 3l5 3.5"/><rect x="5" y="6.5" width="22" height="22" rx="3"/><path d="m8.5 25 5.5-6.5 3.5 3.5 3-3 3 6"/>${brilho(17.5, 9.5, 0.8)}`,
  chaveiro: `<circle cx="10" cy="9" r="5"/><path d="m13.5 12.5 2.5 2.5"/><path style="fill:var(--ico-a)" transform="translate(14 15)" d="M7.5 13.8C3.3 11.1 0 8.4 0 4.8A3.9 3.9 0 0 1 7.5 3a3.9 3.9 0 0 1 7.5 1.8c0 3.6-3.3 6.3-7.5 9z"/>`,
  laco: `<path d="M13.5 14C9 9 4 9.5 4 15.5S9 22 13.5 17M18.5 14C23 9 28 9.5 28 15.5S23 22 18.5 17M14.5 19 11 27.5M17.5 19l3.5 8.5"/><rect style="fill:var(--ico-a)" x="13.5" y="12.5" width="5" height="6.5" rx="1.8"/>`,
  boba: `<path d="M9 9.5a7 4.5 0 0 1 14 0M7 12h18M8.5 12l1.8 15a2 2 0 0 0 2 1.8h7.4a2 2 0 0 0 2-1.8L23.5 12M17.5 8 20 2"/><g ${A}><circle cx="13" cy="24" r="1.5"/><circle cx="16.2" cy="25.6" r="1.5"/><circle cx="19.2" cy="23.8" r="1.5"/><circle cx="14.6" cy="20.8" r="1.5"/><circle cx="17.8" cy="20.6" r="1.5"/></g>`,
  tigela: `<path d="M3.5 15h25c0 6.6-5.6 11.5-12.5 11.5S3.5 21.6 3.5 15ZM11 29h10M19 3.5l-5 9.5M26 6l-8 7"/>${coracao(12.8, 17, 0.65)}`,
  // vantagens e listas
  selo: `<circle cx="16" cy="13" r="9"/><path d="m11.5 20.5-3 8.5 4.5-1.8 2.8 2.8M20.5 20.5l3 8.5-4.5-1.8-2.8 2.8"/>${brilho(11, 8)}`,
  caixa: `<path d="M4 10 16 4l12 6v13l-12 6-12-6ZM4 10l12 6 12-6M16 16v13"/>${coracao(19.5, 17.5, 0.6)}`,
  cartao: `<rect x="3" y="7" width="26" height="18" rx="3"/><path d="M3 12h26M7.5 20h6"/>${coracao(20, 16.5, 0.65)}`,
  fone: `<path d="M6 19v-3a10 10 0 0 1 20 0v3M26 26c0 2.6-2.4 4-6 4h-2"/><rect x="4" y="18" width="5" height="8.5" rx="2"/><rect x="23" y="18" width="5" height="8.5" rx="2"/>${coracao(12.5, 10.5, 0.7)}`,
  caminhao: `<rect x="3" y="7.5" width="15" height="14" rx="2"/><path d="M18 12h5l4.5 5v4.5H18M10.5 23.5h7"/><circle cx="7.5" cy="23.5" r="2.5"/><circle cx="21.5" cy="23.5" r="2.5"/>${coracao(6, 10.5, 0.9)}`,
  cadeado: `<path d="M10 14v-4a6 6 0 0 1 12 0v4"/><rect x="6" y="14" width="20" height="14" rx="3"/>${coracao(12.5, 17.5, 0.7)}`,
  conversa: `<path d="M6.5 6h19a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H13l-6 5v-5h-.5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z"/>${coracao(11, 10.5)}`,
  loja: `<path d="m4 12 2-7h20l2 7M4 12a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M6 15.5V28h20V15.5"/><path style="fill:var(--ico-a)" d="M13 28v-6.5a3 3 0 0 1 6 0V28Z"/>`,
  etiqueta: `<path d="M4 15.5V6a2 2 0 0 1 2-2h9.5L28 16.5 16.5 28Z"/><circle cx="10" cy="10" r="2"/>${coracao(13.5, 15, 0.8)}`,
  // marca e interface
  coracao: `<path style="fill:var(--ico-a)" d="M16 27.5C9 23 3.5 18.6 3.5 12.3A6.4 6.4 0 0 1 16 8.4a6.4 6.4 0 0 1 12.5 3.9c0 6.3-5.5 10.7-12.5 15.2Z"/>`,
  brilho: `<path style="fill:var(--ico-a);stroke:none" d="M16 2c1.7 9.5 4.5 12.3 14 14-9.5 1.7-12.3 4.5-14 14-1.7-9.5-4.5-12.3-14-14 9.5-1.7 12.3-4.5 14-14Z"/>`,
  fechar: `<path d="m9 9 14 14M23 9 9 23"/>`,
  lixeira: `<path d="M6 9h20M12 9V6h8v3M8.5 9l1.4 17.2a2 2 0 0 0 2 1.8h8.2a2 2 0 0 0 2-1.8L23.5 9M13.5 14v9M18.5 14v9"/>`,
} as const;

export type Icone = keyof typeof icones;

/** Insere o sprite no começo do <body>. Chamar uma vez, antes de qualquer render. */
export function montarIcones() {
  const simbolos = Object.entries(icones).map(([nome, corpo]) => `<symbol id="i-${nome}" viewBox="0 0 32 32">${corpo}</symbol>`).join('');
  document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${simbolos}</svg>`);
}

/** Marcação de um ícone. `extra` acrescenta classes (ex.: 'ico--lg'). */
export const ico = (nome: Icone, extra = '') => `<svg class="ico ${extra}" aria-hidden="true"><use href="#i-${nome}"/></svg>`;
