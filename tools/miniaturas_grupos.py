"""Gera as miniaturas quadradas dos grupos (botões do filtro) a partir de public/img/grupos/<slug>.webp.

Cada recorte é um quadrado centrado em (cx, cy), com lado = fração da altura da foto, escolhido para pegar os rostos.
Uso: uv run --system-certs --no-project --with pillow python -I tools/miniaturas_grupos.py
"""
from pathlib import Path

from PIL import Image

PASTA = Path(__file__).resolve().parent.parent / "public" / "img" / "grupos"
SAIDA = PASTA / "mini"
LADO = 112  # 56 px em tela 2x
# slug: (cx, cy, lado/altura)
QUADROS = {
    "bts": (0.5, 0.40, 0.70),
    "blackpink": (0.5, 0.30, 0.52),
    "twice": (0.5, 0.40, 0.72),
    "straykids": (0.5, 0.40, 0.52),
    "txt": (0.5, 0.50, 0.55),
    "ateez": (0.56, 0.66, 0.60),
    "mamamoo": (0.52, 0.32, 0.58),
}

SAIDA.mkdir(exist_ok=True)
for slug, (cx, cy, frac) in QUADROS.items():
    im = Image.open(PASTA / f"{slug}.webp")
    w, h = im.size
    s = frac * h
    x0 = min(max(cx * w - s / 2, 0), w - s)
    y0 = min(max(cy * h - s / 2, 0), h - s)
    mini = im.crop((round(x0), round(y0), round(x0 + s), round(y0 + s))).resize((LADO, LADO), Image.LANCZOS)
    mini.save(SAIDA / f"{slug}.webp", "WEBP", quality=82, method=6)
    print(slug, mini.mode, (SAIDA / f"{slug}.webp").stat().st_size, "bytes")
