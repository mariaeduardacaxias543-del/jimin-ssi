"""Prepara as fotos dos grupos enviadas pela loja (assets-src/grupos/<pasta>/) para o palco do site.

- BTS já vem recortado (PNG com transparência): só cortamos a margem vazia.
- Os demais viram banner: a foto inteira, com o fundo original, em WebP.
  Fotos pequenas (< 1280 px de largura) são ampliadas com Lanczos e um leve unsharp para não borrar no palco.

Uso: uv run --system-certs --no-project --with pillow python -I tools/preparar_banners.py
Imprime a proporção (largura/altura) de cada banner, que vai em src/grupos.ts (campo `ar`).
"""
from pathlib import Path

from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "assets-src" / "grupos"
DESTINO = RAIZ / "public" / "img" / "grupos"
PASTAS = {"bts": "bts", "backpink": "blackpink", "STRAY KIDS": "straykids", "txt": "txt", "ATEEZ": "ateez", "MAMAMOO": "mamamoo", "TWICE": "twice"}
RECORTE = {"bts"}


def primeira_imagem(pasta: Path) -> Image.Image:
    for arq in sorted(pasta.iterdir()):
        try:
            return Image.open(arq)
        except OSError:
            continue
    raise SystemExit(f"nenhuma imagem válida em {pasta}")


for pasta, slug in PASTAS.items():
    im = primeira_imagem(ORIGEM / pasta)
    if slug in RECORTE:
        im = im.convert("RGBA")
        im = im.crop(im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox())
        im.thumbnail((1400, 1400), Image.LANCZOS)
        im.save(DESTINO / f"{slug}.webp", "WEBP", quality=84, method=6)
    else:
        im = im.convert("RGB")
        if im.width < 1280:
            h = round(im.height * 1280 / im.width)
            im = im.resize((1280, h), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
        im.thumbnail((1600, 1600), Image.LANCZOS)
        im.save(DESTINO / f"{slug}.webp", "WEBP", quality=80, method=6)
    tam = (DESTINO / f"{slug}.webp").stat().st_size // 1024
    print(f"{slug:10s} {im.width}x{im.height}  ar={im.width / im.height:.3f}  {tam} KB")
