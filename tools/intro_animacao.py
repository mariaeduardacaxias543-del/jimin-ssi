"""Animação de entrada do site, desenhada quadro a quadro em Python (Pillow).

Gera public/intro/burst.webp: um WebP animado e transparente com uma explosão de
corações e brilhos em volta de um halo, que o site toca atrás do logo na intro.
Também gera public/favicon.png (coroa sobre coração).

Tudo é determinístico (semente fixa), então o arquivo sai igual a cada execução.
Uso: uv run --with pillow python tools/intro_animacao.py
"""
from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
TAM = 440          # lado do quadro final
SS = 2             # supersampling para bordas suaves
QUADROS = 40       # ~1,7 s a 24 fps
CORES = [(255, 31, 142), (255, 122, 26), (255, 178, 107), (185, 140, 255), (255, 233, 199)]


def coracao(d: ImageDraw.ImageDraw, cx: float, cy: float, s: float, cor, ang: float) -> None:
    """Coração paramétrico (curva clássica 16 sin^3 t), girado em `ang` radianos."""
    pts = []
    for i in range(48):
        t = math.tau * i / 48
        x = 16 * math.sin(t) ** 3
        y = -(13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t))
        x, y = x * s / 17, y * s / 17
        pts.append((cx + x * math.cos(ang) - y * math.sin(ang), cy + x * math.sin(ang) + y * math.cos(ang)))
    d.polygon(pts, fill=cor)


def brilho(d: ImageDraw.ImageDraw, cx: float, cy: float, s: float, cor) -> None:
    """Estrela de quatro pontas (o ✦ da marca)."""
    pts = []
    for i in range(8):
        r = s if i % 2 == 0 else s * 0.28
        a = math.pi / 4 * i - math.pi / 2
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    d.polygon(pts, fill=cor)


def ease_out(t: float) -> float:
    return 1 - (1 - t) ** 3


def gerar_burst() -> None:
    rnd = random.Random(7)
    big = TAM * SS
    c = big / 2
    particulas = [
        {
            "ang": rnd.uniform(0, math.tau),
            "dist": rnd.uniform(0.25, 0.47) * big,
            "tam": rnd.uniform(10, 26) * SS,
            "cor": rnd.choice(CORES),
            "tipo": rnd.random() < 0.65,
            "atraso": rnd.uniform(0, 0.25),
            "giro": rnd.uniform(-2, 2),
        }
        for _ in range(42)
    ]
    quadros: list[Image.Image] = []
    for f in range(QUADROS):
        t = f / (QUADROS - 1)
        im = Image.new("RGBA", (big, big), (0, 0, 0, 0))

        # (o halo desfocado fica no CSS: em cada quadro ele triplicava o peso do arquivo)
        # anel que expande e some
        d = ImageDraw.Draw(im)
        ra = big * 0.12 + big * 0.36 * ease_out(t)
        alfa = int(220 * (1 - t))
        d.ellipse((c - ra, c - ra, c + ra, c + ra), outline=(255, 233, 199, alfa), width=int(5 * SS))

        # partículas: saem do centro, desaceleram e somem no fim
        for p in particulas:
            tt = max(0.0, min(1.0, (t - p["atraso"]) / (1 - p["atraso"])))
            if tt <= 0:
                continue
            k = ease_out(tt)
            x = c + math.cos(p["ang"]) * p["dist"] * k
            y = c + math.sin(p["ang"]) * p["dist"] * k + 30 * SS * tt * tt  # leve gravidade
            esc = p["tam"] * (0.4 + 0.6 * k) * (1 - 0.5 * max(0, tt - 0.7) / 0.3)
            cor = (*p["cor"], int(255 * (1 - max(0, tt - 0.75) / 0.25)))
            if p["tipo"]:
                coracao(d, x, y, esc, cor, p["giro"] * tt)
            else:
                brilho(d, x, y, esc, cor)

        quadros.append(im.resize((TAM, TAM), Image.LANCZOS))

    destino = RAIZ / "public" / "intro"
    destino.mkdir(parents=True, exist_ok=True)
    saida = destino / "burst.webp"
    quadros[0].save(saida, save_all=True, append_images=quadros[1:], duration=42, loop=1, lossless=False, quality=68, alpha_quality=100, method=6)
    print(f"{saida.relative_to(RAIZ)}: {QUADROS} quadros, {saida.stat().st_size // 1024} KB")


def gerar_favicon() -> None:
    big = 256
    im = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((8, 8, big - 8, big - 8), radius=60, fill=(255, 31, 142))
    coracao(d, big / 2, big * 0.58, 92, (255, 241, 220), 0)
    d.polygon([(70, 78), (78, 30), (104, 56), (128, 20), (152, 56), (178, 30), (186, 78)], fill=(255, 178, 107))
    im.resize((64, 64), Image.LANCZOS).save(RAIZ / "public" / "favicon.png")
    print("public/favicon.png: 64x64")


if __name__ == "__main__":
    gerar_burst()
    gerar_favicon()
