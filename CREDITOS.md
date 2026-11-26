# Créditos das fotos dos grupos

| Grupo | Origem | Como aparece no site |
|---|---|---|
| BTS | Foto de divulgação enviada pela loja, já sem fundo (`assets-src/grupos/bts/`) | Recorte sobre o degradê do palco |
| BLACKPINK, TWICE, STRAY KIDS, TXT, ATEEZ, MAMAMOO | Fotos de divulgação enviadas pela loja (`assets-src/grupos/<grupo>/`) | A foto inteira vira o banner do palco, esfumada na cor do grupo |

Para trocar uma foto: coloque a nova na pasta do grupo, rode `tools/preparar_banners.py` e, se a proporção mudar, ajuste
`ar` em `src/grupos.ts`. O script pula arquivos que não são imagem (no TWICE há uma página HTML salva como `.webp`).

As fotos de divulgação não têm licença livre: os direitos são dos fotógrafos e das agências. O site diz isso no palco e
em "Créditos das fotos", no rodapé.

## Atenção antes de publicar

- Num trabalho acadêmico, sem fins comerciais e com a origem indicada, o uso de foto de divulgação é o caso mais comum e
  de menor risco. Num site comercial no ar, o ideal é usar as fotos que os distribuidores oficiais liberam para revenda
  ou pedir autorização.
- As fotos também mostram pessoas reais (direito de imagem). O site não deve dar a entender que os artistas ou as
  agências apoiam a loja; o rodapé já diz que a loja é independente.

As demais imagens do site (produtos, drinks, comidas, ambientes e o padrão de fundo) são ilustrativas, geradas por IA
(Higgsfield, Z Image), e não mostram pessoas reais.

## Mapa

O mapa do "Sobre nós" usa MapLibre GL JS (BSD-3) com tiles gratuitos do [OpenFreeMap](https://openfreemap.org), sem chave.
Os dados são do [OpenStreetMap](https://www.openstreetmap.org/copyright) (ODbL), e a atribuição aparece no canto do mapa,
como a licença exige. O pino marca o centro de Caxias (coordenada do Nominatim) até a loja ter endereço.

## Fotos dos produtos

Produtos reais com foto do Wikimedia Commons (lista também no diálogo "Créditos das fotos"):

| Produto | Origem | Licença |
|---|---|---|
| BTS – Dynamite | [capa](https://commons.wikimedia.org/wiki/File:BTS_Dynamite_(DayTime_Version).jpg), Big Hit Entertainment | Domínio público (só texto) |
| BLACKPINK – DEADLINE (EP) | [capa](https://commons.wikimedia.org/wiki/File:Deadline_(EP).png), BLACKPINK / YG | Domínio público (só texto) |
| Stray Kids – KARMA | [capa](https://commons.wikimedia.org/wiki/File:Karma_by_Stray_Kids_cover_(digital).png), JYP Entertainment | Domínio público (só texto) |
| TXT – The Dream Chapter: STAR | [capa](https://commons.wikimedia.org/wiki/File:The_Dream_Chapter_Star_album_cover.jpg), Big Hit Entertainment | Domínio público (formas simples) |
| MAMAMOO – reality in BLACK | [capa](https://commons.wikimedia.org/wiki/File:Mamamoo_-_Reality_in_Black.png), RBW | Domínio público (só texto) |
| Lightstick BLACKPINK × Takashi Murakami | [foto](https://commons.wikimedia.org/wiki/File:Blackpink_x_Takashi_Murakami_lightstick_display.jpg) de Beulagpinkeu, recortada | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) (o recorte segue a mesma licença) |

"Domínio público" é a avaliação do Commons de que a capa não atinge o mínimo de originalidade para direito autoral; os
nomes e logos continuam sendo marcas dos titulares.

Ainda sem foto real (o Commons não tem foto livre): photocards BTS e TWICE, ARMY Bomb, chaveiros TWICE e TXT, pôster
Stray Kids, lightstick ATEEZ e os kits de acessórios do ATEEZ e do MAMAMOO. Coloque a foto em
`assets-src/produtos/<id>/`, rode `tools/preparar_produtos.py` e troque `image` do produto em `src/data.ts` para
`'produtos/<id>'`.
