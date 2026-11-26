// Indicadores do Plano de Marketing Digital (seção 4): visitas, taxa de conversão,
// produtos mais vistos e mais adicionados, desistência no carrinho e uso de cupons.
//
// Demonstração: os eventos ficam no localStorage deste navegador. Em produção,
// os MESMOS eventos vão para o Google Analytics 4 pelo gtag (nomes de evento
// recomendados pelo GA4: view_item, add_to_cart, begin_checkout, purchase).

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

type EventName = 'page_view' | 'view_item' | 'add_to_cart' | 'begin_checkout' | 'purchase' | 'coupon' | 'filter';

interface Data {
  visits: number;
  events: Record<EventName, number>;
  views: Record<string, number>;   // por produto
  adds: Record<string, number>;    // por produto
  filters: Record<string, number>; // por grupo/categoria
  revenue: number;
}

const KEY = 'jimin-ssi:analytics';
const empty = (): Data => ({ visits: 0, events: { page_view: 0, view_item: 0, add_to_cart: 0, begin_checkout: 0, purchase: 0, coupon: 0, filter: 0 }, views: {}, adds: {}, filters: {}, revenue: 0 });

function load(): Data {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...empty(), ...JSON.parse(raw) }; } catch { /* ignore */ }
  return empty();
}
const data = load();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ } };

export function track(name: EventName, params: { id?: string; label?: string; value?: number } = {}) {
  data.events[name] = (data.events[name] ?? 0) + 1;
  if (name === 'page_view') data.visits++;
  if (name === 'view_item' && params.id) data.views[params.id] = (data.views[params.id] ?? 0) + 1;
  if (name === 'add_to_cart' && params.id) data.adds[params.id] = (data.adds[params.id] ?? 0) + 1;
  if (name === 'filter' && params.label) data.filters[params.label] = (data.filters[params.label] ?? 0) + 1;
  if (name === 'purchase' && params.value) data.revenue += params.value;
  save();
  // GA4, se o snippet do gtag estiver na página
  window.gtag?.('event', name, { item_id: params.id, item_name: params.label, value: params.value, currency: 'BRL' });
}

export function report() {
  const e = data.events;
  const top = (rec: Record<string, number>) => Object.entries(rec).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const pct = (a: number, b: number) => (b ? (a / b) * 100 : 0);
  return {
    visits: data.visits,
    conversion: pct(e.purchase, data.visits),        // pedidos ÷ visitas
    cartRate: pct(e.add_to_cart, data.visits),       // adições ÷ visitas
    abandonment: e.begin_checkout ? 100 - pct(e.purchase, e.begin_checkout) : 0, // desistência no checkout
    orders: e.purchase,
    revenue: data.revenue,
    coupons: e.coupon,
    topViews: top(data.views),
    topAdds: top(data.adds),
    topFilters: top(data.filters),
  };
}

export function resetAnalytics() {
  Object.assign(data, empty());
  save();
}
