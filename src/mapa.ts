// Mapa de Caxias-MA na seção "Sobre nós": MapLibre GL JS 6 + tiles gratuitos do OpenFreeMap (sem chave, dados do OpenStreetMap).
// Carregado sob demanda (import dinâmico em main.ts) para não pesar o primeiro carregamento.
import { Map as MapaGL, Marker, NavigationControl, AttributionControl, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// O MapLibre 6 procura o worker ao lado do próprio arquivo; no bundle do Vite ele precisa vir como asset.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { ico } from './icones';

setWorkerUrl(workerUrl);

/** Centro de Caxias-MA segundo o Nominatim/OpenStreetMap. O endereço da loja ainda não foi definido, então o pino marca a cidade. */
const CAXIAS: [number, number] = [-43.35366, -4.86542];
const estilo = () => `https://tiles.openfreemap.org/styles/${document.documentElement.dataset.theme === 'borahae' ? 'dark' : 'positron'}`;

export function montarMapa(el: HTMLElement, reducedMotion: boolean) {
  const mapa = new MapaGL({
    container: el,
    style: estilo(),
    center: reducedMotion ? CAXIAS : [-44.3, -5.2], // começa mostrando a região e voa até Caxias
    zoom: reducedMotion ? 13.5 : 7,
    cooperativeGestures: true, // a rolagem da página não fica presa no mapa (Ctrl + rolagem ou dois dedos para mexer)
    attributionControl: false,
  });
  mapa.addControl(new NavigationControl({ showCompass: false }), 'top-right');
  mapa.addControl(new AttributionControl({ compact: true }), 'bottom-right');

  const pino = document.createElement('div');
  pino.className = 'pin';
  pino.innerHTML = `<span class="pin__pulse"></span><span class="pin__head">${ico('coracao')}</span><span class="pin__label">Jimin-ssi</span>`;
  new Marker({ element: pino, anchor: 'bottom' }).setLngLat(CAXIAS).addTo(mapa);

  mapa.once('load', () => {
    el.classList.add('is-ready');
    if (!reducedMotion) mapa.flyTo({ center: CAXIAS, zoom: 13.5, pitch: 35, duration: 3200, essential: true });
  });
  mapa.on('error', (e) => { el.classList.add('is-ready'); console.warn('[mapa]', e.error?.message); }); // tile que falhar não deixa o "carregando" preso

  // acompanha o tema noite (Borahae)
  new MutationObserver(() => mapa.setStyle(estilo())).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
