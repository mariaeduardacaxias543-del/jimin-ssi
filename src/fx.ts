// Partículas em canvas (corações e brilhos) seguindo o checklist AN-08 do acervo:
// pool fixo de objetos, dpr limitado a 2, pausa fora de foco, nada de shadowBlur,
// e desligado quando o usuário prefere movimento reduzido.

type Kind = 0 | 1; // 0 = coração, 1 = brilho

interface P { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; rot: number; vr: number; kind: Kind; color: number; alive: boolean }

const POOL = 160;
const pool: P[] = Array.from({ length: POOL }, () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, size: 1, rot: 0, vr: 0, kind: 0, color: 0, alive: false }));

let ctx: CanvasRenderingContext2D | null = null;
let canvas: HTMLCanvasElement;
let w = 0, h = 0, dpr = 1;
let raf = 0;
let running = false;
let ambient = true;
let palette = ['#ff1f8e', '#ff7a1a', '#ffb26b', '#b98cff'];
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = innerWidth; h = innerHeight;
  canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawn(x: number, y: number, vx: number, vy: number, kind: Kind, size: number, max: number) {
  const p = pool.find((q) => !q.alive);
  if (!p) return;
  p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.kind = kind; p.size = size;
  p.life = 0; p.max = max; p.rot = Math.random() * 6.28; p.vr = (Math.random() - 0.5) * 0.1;
  p.color = (Math.random() * palette.length) | 0; p.alive = true;
}

function heartPath(c: CanvasRenderingContext2D, s: number) {
  c.moveTo(0, s * 0.3);
  c.bezierCurveTo(-s, -s * 0.4, -s * 0.5, -s * 1.1, 0, -s * 0.5);
  c.bezierCurveTo(s * 0.5, -s * 1.1, s, -s * 0.4, 0, s * 0.3);
}

function sparkPath(c: CanvasRenderingContext2D, s: number) {
  c.moveTo(0, -s); c.quadraticCurveTo(0, 0, s, 0); c.quadraticCurveTo(0, 0, 0, s);
  c.quadraticCurveTo(0, 0, -s, 0); c.quadraticCurveTo(0, 0, 0, -s);
}

let last = 0;
let ambientTimer = 0;
function frame(t: number) {
  if (!ctx) return;
  const dt = Math.min(48, t - (last || t)) / 16.67; last = t;
  ctx.clearRect(0, 0, w, h);
  if (ambient) {
    ambientTimer += dt;
    if (ambientTimer > 9) { ambientTimer = 0; spawn(Math.random() * w, h + 20, (Math.random() - 0.5) * 0.4, -0.6 - Math.random() * 0.8, Math.random() < 0.6 ? 0 : 1, 5 + Math.random() * 7, 520); }
  }
  // desenha agrupado por cor (poucas chamadas de desenho)
  for (let ci = 0; ci < palette.length; ci++) {
    ctx.fillStyle = palette[ci];
    for (const p of pool) {
      if (!p.alive || p.color !== ci) continue;
      p.life += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 0.012 * dt * (p.max < 200 ? 1 : 0); p.rot += p.vr * dt;
      if (p.life > p.max || p.y < -40 || p.y > h + 60) { p.alive = false; continue; }
      const a = 1 - p.life / p.max;
      ctx.globalAlpha = Math.max(0, Math.min(1, a * 1.4)) * 0.85;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.beginPath();
      if (p.kind === 0) heartPath(ctx, p.size); else sparkPath(ctx, p.size);
      ctx.fill(); ctx.restore();
    }
  }
  ctx.globalAlpha = 1;
  raf = requestAnimationFrame(frame);
}

function start() { if (!running && !reducedMotion) { running = true; last = 0; raf = requestAnimationFrame(frame); } }
function stop() { running = false; cancelAnimationFrame(raf); }

export function initFx() {
  canvas = document.getElementById('fx') as HTMLCanvasElement;
  ctx = canvas.getContext('2d');
  if (!ctx || reducedMotion) return;
  resize();
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
}

/** Explosão de corações num ponto da tela (favoritar, adicionar, confete). */
export function burst(x: number, y: number, n = 18, force = 1) {
  if (reducedMotion || !ctx) return;
  for (let i = 0; i < n; i++) {
    const ang = (Math.PI * 2 * i) / n + Math.random() * 0.4;
    const sp = (2 + Math.random() * 3.5) * force;
    spawn(x, y, Math.cos(ang) * sp, Math.sin(ang) * sp - 1.5, Math.random() < 0.7 ? 0 : 1, 4 + Math.random() * 6, 60 + Math.random() * 40);
  }
}

export function setPalette(colors: string[]) { palette = colors; pool.forEach((p) => (p.color %= palette.length)); }
export function setAmbient(on: boolean) { ambient = on; }
