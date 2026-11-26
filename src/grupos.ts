import type { Group } from './data';

// Fotos: as da pasta assets-src/grupos/<grupo>/ foram enviadas pela loja (tools/preparar_banners.py).
// - recorte: PNG sem fundo, entra sobre o degradê do palco (BTS).
// - banner: a foto inteira vira o fundo do palco, ancorada à direita e esfumada na cor --g2.
// Cores: --g2 é um tom escuro tirado da borda de cada foto, para o degradê emendar com ela. Não são cores oficiais.
export interface GrupoInfo {
  id: Group;
  slug: string;
  fandom: string;
  integrantes: number;
  estreia: number;
  cores: [string, string, string]; // luz, fundo escuro, destaque
  modo: 'recorte' | 'banner';
  ar?: number; // largura/altura do banner
  foco?: string; // object-position do banner quando a tela corta as laterais
  /** Só para fotos de licença livre, que exigem crédito. As demais são fotos de divulgação enviadas pela loja. */
  licenca?: { autor: string; nome: string; url: string; fonte: string };
}

export const grupos: GrupoInfo[] = [
  { id: 'BTS', slug: 'bts', fandom: 'ARMY', integrantes: 7, estreia: 2013, cores: ['#b98cff', '#3b1a78', '#ffd166'], modo: 'recorte' },
  { id: 'BLACKPINK', slug: 'blackpink', fandom: 'BLINK', integrantes: 4, estreia: 2016, cores: ['#c09d8a', '#2a1a14', '#ff6fb0'], modo: 'banner', ar: 1.5 },
  { id: 'TWICE', slug: 'twice', fandom: 'ONCE', integrantes: 9, estreia: 2015, cores: ['#f1b8c7', '#a3385f', '#fff1dc'], modo: 'banner', ar: 1.25 },
  { id: 'STRAY KIDS', slug: 'straykids', fandom: 'STAY', integrantes: 8, estreia: 2018, cores: ['#4195de', '#0f2342', '#ff5a5a'], modo: 'banner', ar: 1.5 },
  { id: 'TXT', slug: 'txt', fandom: 'MOA', integrantes: 5, estreia: 2019, cores: ['#6d8197', '#1b2129', '#e0f2ff'], modo: 'banner', ar: 1.5, foco: '55% 50%' },
  { id: 'ATEEZ', slug: 'ateez', fandom: 'ATINY', integrantes: 8, estreia: 2018, cores: ['#9a9a9a', '#101010', '#ffa24c'], modo: 'banner', ar: 1.778 },
  { id: 'MAMAMOO', slug: 'mamamoo', fandom: 'MooMoo', integrantes: 4, estreia: 2014, cores: ['#86969c', '#182022', '#ff5c8a'], modo: 'banner', ar: 1.26 },
];

export const fotoGrupo = (slug: string) => `/img/grupos/${slug}.webp`;
export const grupoPorId = (id: string) => grupos.find((g) => g.id === id);

/** Texto curto de crédito, em HTML, para o palco e o diálogo de créditos. */
export const creditoHtml = (g: GrupoInfo) =>
  g.licenca
    ? `Foto: ${g.licenca.autor}, <a href="${g.licenca.url}" target="_blank" rel="noopener">${g.licenca.nome}</a>, via <a href="${g.licenca.fonte}" target="_blank" rel="noopener">Wikimedia Commons</a> (fundo removido)`
    : 'Foto de divulgação. Direitos reservados aos respectivos titulares.';
