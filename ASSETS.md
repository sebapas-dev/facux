# Assets

Todo lo visual que ya está en el repo es un **placeholder generado en el proyecto**
(SVG propio o CSS). Esta lista es lo que hay que reemplazar con material real.

Convención: los archivos van en `public/assets/<categoría>/` y se referencian como
`/assets/<categoría>/<archivo>` desde el código.

## Imágenes

| Archivo | Dónde se usa | Formato | Proporción / tamaño sugerido | Estado |
| --- | --- | --- | --- | --- |
| `harley/moto.png` | Pantalla 2, moto al centro | PNG con transparencia | ~16:10 · ideal 1600×1000 px | ✅ puesto (Fat Boy recortada, 900×664, mira a la derecha, 93 KB). Se puede reemplazar por una mejor / más liviana. Si falla la carga, cae a `MotoSilhouette.tsx` |
| `harley/logo.svg` | Pantalla 2, arriba | SVG (o PNG 2x) | ~3:1 · ancho ~480 px | 🟡 hoy hay un escudo placeholder (`HarleyLogo.tsx`), marca genérica. Reemplazar el componente. **No** usar el trademark real |
| `final/regalo.jpg` | Pantalla 5, slot de imagen | JPG/PNG/WebP | 1:1 · 800×800 px | ⛔️ falta — hoy es un recuadro punteado |

## SVG propios ya incluidos (no hace falta reemplazar)

- `public/favicon.svg` — hongo.
- `public/assets/textures/grain.svg` — textura de grano (se tilea, `mix-blend-multiply`).
- Hongo in-app: `src/components/Mushroom.tsx`.
- Caleidoscopio del hongo: `src/components/Kaleidoscope.tsx` (canvas 2D).
- Casete: `src/components/cassette/Cassette.tsx` (carcasa, ventana, dos carretes, agujeros).
- Flor psicodélica del atajo: `src/components/cassette/TripOverlay.tsx`.
- Luna con las 8 fases: `src/components/moon/Moon.tsx` (máscara SVG, sin imágenes).
- Estrellas y cielo: `src/components/moon/Stars.tsx` y el gradiente en `MoonScreen.tsx`.
- Fondo psicodélico de "consumir": `src/components/TrippyCanvas.tsx` (canvas 2D).

### Lobo

`src/components/moon/wolfPath.ts` — silueta de lobo aullando, a partir del SVG
que aportaste (`3322007.svg`, trazado con potrace). Coordenadas en el espacio
original del archivo; `Wolf.tsx` la envuelve en
`translate(0,1280) scale(0.1,-0.1)` y le aplica un degradado gris → blanco.

> ⚠️ Verificá la licencia de ese SVG antes de publicar la web, aunque sea un
> regalo personal.

Para cambiarlo: reemplazá `WOLF_PATH` y ajustá `MUZZLE` (punta del hocico, de
donde salen las ondas de aullido) y el `viewBox` de `Wolf.tsx`.

## Audio

Formato recomendado: **MP3** (compat iOS/Safari) o `.m4a`. Mono, ~128 kbps alcanza.
Si un archivo no existe, la app no rompe: el sonido simplemente no suena.

| Archivo | Dónde se usa | Notas |
| --- | --- | --- |
| `audio/bg-music.mp3` | Loop de fondo (todas las pantallas) | Setentoso, loopeable sin costura. Arranca en el primer gesto del usuario, volumen ~0.32. Referenciado en `BackgroundMusic.tsx`. |
| `audio/harley-fail.mp3` | Pantalla 2, patada sin batería | Motor que gira y no prende. 1–2 s. Referenciado (`lib/sfx.ts`). |
| `audio/harley-start.mp3` | Pantalla 2, arranque con batería | Encendido + acelerada. 2–3 s. Referenciado (`lib/sfx.ts`). |
| `audio/cassette-rewind.mp3` | Pantalla 3, rebobinado | Chirrido de cinta. ~2 s. Opcional. |
| `audio/wolf-howl.mp3` | Pantalla 4, luna llena | Aullido. 2–4 s. |

> Los paths viven en `src/lib/sfx.ts`. Si un archivo no existe, el sonido
> simplemente no suena (howler falla en silencio).
