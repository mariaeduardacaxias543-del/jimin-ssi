import type { Icone } from './icones';
// Catálogo de exemplo alinhado ao Plano de Marketing Digital da loja:
// vários grupos, faixas de preço (acessível → colecionador), disponibilidade,
// combos e cupons. Troque nomes, preços e estoque pelos reais.

export type CategoryId = 'todos' | 'albuns' | 'photocards' | 'lightsticks' | 'posteres' | 'chaveiros' | 'acessorios' | 'drinks' | 'comidas';
export type Group = 'BTS' | 'BLACKPINK' | 'TWICE' | 'STRAY KIDS' | 'TXT' | 'ATEEZ' | 'MAMAMOO';
export type Stock = 'estoque' | 'ultimas' | 'prevenda';
export type PriceTier = 'todas' | 'acessivel' | 'medio' | 'colecionador';

export interface Category { id: CategoryId; label: string; icon: Icone }

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Exclude<CategoryId, 'todos'>;
  group?: Group;            // drinks e comidas não têm grupo
  image: string;
  stock: Stock;
  badge?: string;
  description: string;
  hue?: number;             // variação de cor da mesma foto (filtro CSS)
  /** Foto real do produto (Wikimedia Commons). Sem isso, a imagem é ilustrativa. */
  foto?: { autor: string; licenca: string; url: string };
}

export const groups: Group[] = ['BTS', 'BLACKPINK', 'TWICE', 'STRAY KIDS', 'TXT', 'ATEEZ', 'MAMAMOO'];

export const categories: Category[] = [
  { id: 'todos', label: 'Tudo', icon: 'tudo' },
  { id: 'albuns', label: 'Álbuns', icon: 'album' },
  { id: 'photocards', label: 'Photocards', icon: 'photocard' },
  { id: 'lightsticks', label: 'Lightsticks', icon: 'lightstick' },
  { id: 'posteres', label: 'Pôsteres', icon: 'poster' },
  { id: 'chaveiros', label: 'Chaveiros', icon: 'chaveiro' },
  { id: 'acessorios', label: 'Acessórios', icon: 'laco' },
  { id: 'drinks', label: 'Drinks', icon: 'boba' },
  { id: 'comidas', label: 'Comidas', icon: 'tigela' },
];

export const tiers: { id: PriceTier; label: string; test: (v: number) => boolean }[] = [
  { id: 'todas', label: 'Todos os preços', test: () => true },
  { id: 'acessivel', label: 'Até R$ 50', test: (v) => v <= 50 },
  { id: 'medio', label: 'R$ 50 a R$ 150', test: (v) => v > 50 && v <= 150 },
  { id: 'colecionador', label: 'Colecionador', test: (v) => v > 150 },
];

export const stockLabel: Record<Stock, string> = { estoque: 'Em estoque', ultimas: 'Últimas unidades', prevenda: 'Pré-venda' };

export const products: Product[] = [
  // BTS
  { id: 'bts-dynamite', name: 'BTS – Dynamite (single físico)', price: 89.9, category: 'albuns', group: 'BTS', image: 'produtos/bts-dynamite', stock: 'estoque', badge: 'Mais vendido', description: 'Single de 2020, o primeiro nº 1 do BTS na Billboard Hot 100.', foto: { autor: 'Big Hit Entertainment', licenca: 'Domínio público', url: 'https://commons.wikimedia.org/wiki/File:BTS_Dynamite_(DayTime_Version).jpg' } },
  { id: 'bts-pc', name: 'Kit Photocards BTS', price: 29.9, category: 'photocards', group: 'BTS', image: 'photocards', stock: 'estoque', description: 'Conjunto colecionável com acabamento holográfico.' },
  { id: 'bts-army-bomb', name: 'Lightstick BTS (ARMY Bomb)', price: 349.9, category: 'lightsticks', group: 'BTS', image: 'lightstick', stock: 'ultimas', badge: 'Colecionador', description: 'Lightstick oficial com conexão Bluetooth para shows.' },
  // BLACKPINK
  { id: 'bp-deadline', name: 'BLACKPINK – DEADLINE (EP)', price: 189.9, category: 'albuns', group: 'BLACKPINK', image: 'produtos/bp-deadline', stock: 'estoque', description: 'EP do BLACKPINK. Versão física com encarte.', foto: { autor: 'BLACKPINK / YG Entertainment', licenca: 'Domínio público', url: 'https://commons.wikimedia.org/wiki/File:Deadline_(EP).png' } },
  { id: 'bp-murakami', name: 'Lightstick BLACKPINK × Takashi Murakami', price: 499.9, category: 'lightsticks', group: 'BLACKPINK', image: 'produtos/bp-murakami', stock: 'ultimas', badge: 'Edição limitada', description: 'Lightstick oficial da colaboração do BLACKPINK com o artista japonês Takashi Murakami, com a caixa colecionável.', foto: { autor: 'Beulagpinkeu', licenca: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Blackpink_x_Takashi_Murakami_lightstick_display.jpg' } },
  // TWICE
  { id: 'twice-pc', name: 'Photocards TWICE (pack 9)', price: 39.9, category: 'photocards', group: 'TWICE', image: 'photocards', hue: 330, stock: 'estoque', badge: 'Novo', description: 'Pack com 9 cards e sleeve protetora.' },
  { id: 'twice-key', name: 'Chaveiro TWICE', price: 24.9, category: 'chaveiros', group: 'TWICE', image: 'keychains', stock: 'estoque', description: 'Chaveiro de acrílico com pingente de coração.' },
  // STRAY KIDS
  { id: 'skz-karma', name: 'Stray Kids – KARMA (4º álbum)', price: 199.9, category: 'albuns', group: 'STRAY KIDS', image: 'produtos/skz-karma', stock: 'prevenda', badge: 'Pré-venda', description: 'Quarto álbum de estúdio do Stray Kids. Reserve o seu: envio assim que chegar à loja.', foto: { autor: 'Stray Kids / JYP Entertainment', licenca: 'Domínio público', url: 'https://commons.wikimedia.org/wiki/File:Karma_by_Stray_Kids_cover_(digital).png' } },
  { id: 'skz-poster', name: 'Pôster STRAY KIDS', price: 34.9, category: 'posteres', group: 'STRAY KIDS', image: 'posters', hue: 200, stock: 'estoque', description: 'Pôster dobrado em papel couché, tamanho A2.' },
  // TXT
  { id: 'txt-key', name: 'Chaveiro TXT', price: 24.9, category: 'chaveiros', group: 'TXT', image: 'keychains', hue: 180, stock: 'ultimas', description: 'Chaveiro de acrílico com estrelinhas.' },
  { id: 'txt-star', name: 'TXT – The Dream Chapter: STAR', price: 149.9, category: 'albuns', group: 'TXT', image: 'produtos/txt-star', stock: 'estoque', description: 'EP de estreia do TXT (2019), com a faixa “CROWN”.', foto: { autor: 'Big Hit Entertainment', licenca: 'Domínio público', url: 'https://commons.wikimedia.org/wiki/File:The_Dream_Chapter_Star_album_cover.jpg' } },
  // ATEEZ
  { id: 'ateez-ls', name: 'Lightstick ATEEZ', price: 329.9, category: 'lightsticks', group: 'ATEEZ', image: 'lightstick', hue: 200, stock: 'ultimas', badge: 'Colecionador', description: 'Lightstick oficial para shows e coleção.' },
  { id: 'ateez-kit', name: 'Kit Acessórios ATEEZ', price: 59.9, category: 'acessorios', group: 'ATEEZ', image: 'accessories', hue: 20, stock: 'estoque', description: 'Pins, adesivos e chaveiro temático.' },
  // MAMAMOO
  { id: 'mmm-reality', name: 'MAMAMOO – reality in BLACK', price: 179.9, category: 'albuns', group: 'MAMAMOO', image: 'produtos/mmm-reality', stock: 'estoque', description: 'Segundo álbum de estúdio do MAMAMOO (2019), com a faixa “HIP”.', foto: { autor: 'RBW', licenca: 'Domínio público', url: 'https://commons.wikimedia.org/wiki/File:Mamamoo_-_Reality_in_Black.png' } },
  { id: 'mmm-kit', name: 'Kit Acessórios MAMAMOO', price: 49.9, category: 'acessorios', group: 'MAMAMOO', image: 'accessories', stock: 'estoque', description: 'Pins, chaveiros e adesivos.' },
  // Drinks e comidas (área complementar)
  { id: 'purple-dream', name: 'Drink Purple Dream', price: 18.9, category: 'drinks', image: 'drink-purple', stock: 'estoque', badge: 'Assinatura', description: 'Taro cremoso, chantilly, mirtilos e granulado de estrelas.' },
  { id: 'pink-blossom', name: 'Drink Pink Blossom', price: 17.9, category: 'drinks', image: 'drink-pink', stock: 'estoque', description: 'Leite de morango com pérolas rosas e chantilly.' },
  { id: 'mango-pop', name: 'Drink Mango Pop', price: 18.9, category: 'drinks', image: 'drink-mango', stock: 'estoque', description: 'Manga com maracujá, gelado e cítrico.' },
  { id: 'galaxy', name: 'Drink Galáxia', price: 21.9, category: 'drinks', image: 'drink-galaxy', stock: 'estoque', badge: 'Brilha', description: 'Camadas de roxo a azul com glitter comestível.' },
  { id: 'tteok', name: 'Bowl de Tteokbokki', price: 24.9, category: 'comidas', image: 'food-tteok', stock: 'estoque', description: 'Bolinho de arroz no molho gochujang, ovo e sésamo.' },
  { id: 'kimbap', name: 'Kimbap da Casa', price: 22.9, category: 'comidas', image: 'food-kimbap', stock: 'estoque', description: 'Rolinhos coreanos com recheio colorido.' },
];

/** Combos promocionais (campanhas do plano: combos e quantidade limitada). */
export interface Combo { id: string; name: string; items: string[]; discount: number; tag: string; image: string }
export const combos: Combo[] = [
  { id: 'combo-fa', name: 'Combo Fã: álbum + drink', items: ['bts-dynamite', 'purple-dream'], discount: 0.1, tag: '10% off', image: 'instagram' },
  { id: 'combo-colecao', name: 'Combo Coleção: photocards TWICE + BTS', items: ['twice-pc', 'bts-pc'], discount: 0.15, tag: '15% off', image: 'photocards' },
  { id: 'combo-lanche', name: 'Combo Lanche: tteokbokki + drink', items: ['tteok', 'pink-blossom'], discount: 0.12, tag: '12% off', image: 'food-tteok' },
];

/** Cupons de fidelização (validados só no front: em produção, valide no servidor). */
export const coupons: Record<string, { pct: number; label: string }> = {
  BEMVINDO10: { pct: 0.1, label: '10% na primeira compra' },
  FIDELIDADE15: { pct: 0.15, label: '15% para clientes recorrentes' },
};

export interface LabOption { id: string; label: string; price: number; colors?: [string, string]; color?: string }

export const labBases: LabOption[] = [
  { id: 'taro', label: 'Taro', price: 14.9, colors: ['#c9a6ff', '#6a2fd6'] },
  { id: 'morango', label: 'Morango', price: 13.9, colors: ['#ffc2d6', '#ff4f8b'] },
  { id: 'manga', label: 'Manga', price: 14.9, colors: ['#ffd27a', '#ff7a1a'] },
  { id: 'galaxia', label: 'Galáxia', price: 16.9, colors: ['#8fd3ff', '#3b1a8f'] },
];

export const labPearls: LabOption[] = [
  { id: 'nenhuma', label: 'Sem pérolas', price: 0 },
  { id: 'tapioca', label: 'Tapioca', price: 2, color: '#3a2233' },
  { id: 'morango', label: 'Popping morango', price: 3, color: '#ff3d7f' },
  { id: 'estrela', label: 'Estrelinhas', price: 3, color: '#ffd23f' },
];

export const labTops: LabOption[] = [
  { id: 'chantilly', label: 'Chantilly', price: 2 },
  { id: 'coracoes', label: 'Corações', price: 2.5 },
  { id: 'nada', label: 'Sem cobertura', price: 0 },
];

export const FREE_SHIPPING = 299;

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
