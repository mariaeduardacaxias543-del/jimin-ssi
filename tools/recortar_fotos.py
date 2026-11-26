"""Recorta o fundo das fotos dos grupos (Wikimedia Commons, licenças livres) e gera WebP transparente.

Entrada: assets-src/grupos/<slug>.jpg  (originais baixados do Commons, ver CREDITOS.md)
Saída:   public/img/grupos/<slug>.webp (fundo transparente, lado maior 1400 px)

Modelo: BiRefNet (rembg). Na primeira execução o rembg baixa o modelo (~900 MB) do GitHub.
Uso: uv run --with "rembg[cpu]" --with pillow python tools/recortar_fotos.py [slug ...]
"""
import sys
from pathlib import Path

try:  # usa os certificados do Windows (o antivírus intercepta HTTPS com CA própria; ver lição L-045)
    import truststore
    truststore.inject_into_ssl()
except ImportError:
    pass

from PIL import Image
from rembg import new_session, remove

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "assets-src" / "grupos"
DESTINO = RAIZ / "public" / "img" / "grupos"


# Enquadramento antes do recorte, em frações (esquerda, topo, direita, base) da foto original:
# ATEEZ aparece pequeno no palco; BLACKPINK tem marca d'água embaixo; TWICE: só a faixa do palco onde elas estão.
ENQUADRAR = {
    "ateez": (0.20, 0.50, 0.80, 1.00),
    "blackpink": (0.00, 0.00, 1.00, 0.93),
    "twice": (0.00, 0.35, 1.00, 0.91),
}


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    sessao = new_session("birefnet-general")
    alvos = sys.argv[1:] or [p.stem for p in sorted(ORIGEM.glob("*.jpg"))]
    for slug in alvos:
        img = Image.open(ORIGEM / f"{slug}.jpg").convert("RGB")
        if slug in ENQUADRAR:
            l, t, r, b = ENQUADRAR[slug]
            img = img.crop((int(l * img.width), int(t * img.height), int(r * img.width), int(b * img.height)))
        img.thumbnail((2000, 2000), Image.LANCZOS)  # o modelo trabalha em 1024; 2000 mantém a borda nítida
        recorte = remove(img, session=sessao, post_process_mask=True)
        caixa = recorte.getbbox()                    # corta o vazio em volta das pessoas
        if caixa:
            recorte = recorte.crop(caixa)
        recorte.thumbnail((1400, 1400), Image.LANCZOS)
        saida = DESTINO / f"{slug}.webp"
        recorte.save(saida, "WEBP", quality=82, method=6)
        print(f"{slug}: {recorte.width}x{recorte.height}, {saida.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
