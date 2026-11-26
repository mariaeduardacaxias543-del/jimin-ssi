import { products, coupons, type Product } from './data';

export interface CartLine {
  id: string;          // id do produto ou "lab:<combinação>"
  name: string;
  price: number;
  image: string;
  hue?: number;
  qty: number;
}

type Listener = () => void;

const KEY = 'jimin-ssi:v1';

function load(): { cart: CartLine[]; favs: string[]; coupon: string } {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.cart) && Array.isArray(data.favs)) return { coupon: '', ...data };
    }
  } catch { /* storage indisponível: começa vazio */ }
  return { cart: [], favs: [], coupon: '' };
}

const state = load();
const listeners = new Set<Listener>();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignora */ }
  listeners.forEach((fn) => fn());
}

export const store = {
  subscribe(fn: Listener) { listeners.add(fn); return () => listeners.delete(fn); },
  get cart() { return state.cart; },
  get favs() { return state.favs; },
  count() { return state.cart.reduce((n, l) => n + l.qty, 0); },
  subtotal() { return state.cart.reduce((s, l) => s + l.price * l.qty, 0); },
  get coupon() { return state.coupon; },
  discount() { const c = coupons[state.coupon]; return c ? Math.round(this.subtotal() * c.pct * 100) / 100 : 0; },
  applyCoupon(code: string): boolean {
    const k = code.trim().toUpperCase();
    if (!coupons[k]) return false;
    state.coupon = k; save(); return true;
  },
  clear() { state.cart = []; state.coupon = ''; save(); },
  addProduct(p: Product) {
    this.addLine({ id: p.id, name: p.name, price: p.price, image: p.image, hue: p.hue, qty: 1 });
  },
  addLine(line: CartLine) {
    const found = state.cart.find((l) => l.id === line.id);
    if (found) found.qty += line.qty; else state.cart.push({ ...line });
    save();
  },
  setQty(id: string, qty: number) {
    const line = state.cart.find((l) => l.id === id);
    if (!line) return;
    line.qty = Math.max(0, Math.min(99, qty));
    if (line.qty === 0) state.cart = state.cart.filter((l) => l.id !== id);
    save();
  },
  remove(id: string) { state.cart = state.cart.filter((l) => l.id !== id); save(); },
  toggleFav(id: string): boolean {
    const i = state.favs.indexOf(id);
    if (i >= 0) state.favs.splice(i, 1); else state.favs.push(id);
    save();
    return i < 0;
  },
  isFav(id: string) { return state.favs.includes(id); },
  product(id: string) { return products.find((p) => p.id === id); },
};
