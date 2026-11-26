"""Converte as imagens geradas pela Higgsfield (assets-src/*.png) em WebP para o site.

- public/img/<nome>.webp  (lado maior 1600 px nas cenas 16:9 e 4:3, 900 px nas quadradas)
- tools/contato.jpg       (folha de contato para revisar tudo de uma vez)

Uso: uv run --with pillow python tools/otimizar_imagens.py
"""
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "assets-src"
DESTINO = RAIZ / "public" / "img"


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    miniaturas = []
    for png in sorted(ORIGEM.glob("*.png")):
        im = Image.open(png).convert("RGB")
        lado = 900 if im.width == im.height else 1600
        im.thumbnail((lado, lado), Image.LANCZOS)
        saida = DESTINO / f"{png.stem}.webp"
        im.save(saida, "WEBP", quality=80, method=6)
        print(f"{png.name:22} -> {saida.name:22} {im.width}x{im.height} {saida.stat().st_size // 1024} KB")
        mini = im.copy()
        mini.thumbnail((300, 300))
        miniaturas.append(mini)

    if miniaturas:
        col = 5
        lin = (len(miniaturas) + col - 1) // col
        folha = Image.new("RGB", (col * 300, lin * 300), "white")
        for i, m in enumerate(miniaturas):
            folha.paste(m, ((i % col) * 300, (i // col) * 300))
        folha.save(RAIZ / "tools" / "contato.jpg", quality=80)


if __name__ == "__main__":
    main()
