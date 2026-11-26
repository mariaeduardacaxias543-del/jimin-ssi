"""Converte as fotos de produtos enviadas pela loja (assets-src/produtos/<id>/) para public/img/produtos/<id>.webp.

Pega a primeira imagem válida de cada pasta (pula páginas HTML salvas com extensão de imagem), corta no quadrado
central e salva com até 800 px. Depois, troque `image` do produto em src/data.ts para 'produtos/<id>'.
Uso: uv run --system-certs --no-project --with pillow python -I tools/preparar_produtos.py
"""
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "assets-src" / "produtos"
DESTINO = RAIZ / "public" / "img" / "produtos"
DESTINO.mkdir(parents=True, exist_ok=True)

for pasta in sorted(p for p in ORIGEM.iterdir() if p.is_dir()):
    foto = None
    for arq in sorted(pasta.iterdir()):
        try:
            foto = Image.open(arq).convert("RGB")
            break
        except OSError:
            continue
    if foto is None:
        print(f"{pasta.name:14s} sem foto ainda")
        continue
    w, h = foto.size
    lado = min(w, h)
    foto = foto.crop(((w - lado) // 2, (h - lado) // 2, (w + lado) // 2, (h + lado) // 2))
    foto.thumbnail((800, 800), Image.LANCZOS)
    foto.save(DESTINO / f"{pasta.name}.webp", "WEBP", quality=84, method=6)
    print(f"{pasta.name:14s} ok {foto.size} -> produtos/{pasta.name}")
