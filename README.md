# facux

Regalo de cumpleaños para Facundo: puzzles encadenados que se destraban pantalla
por pantalla hasta una revelación final. One-shot, iterable.

## Correr

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build estático en dist/
npm run preview    # sirve dist/
```

Deploy: build estático, sin backend. En Vercel/Netlify apuntar el output a `dist/`
(Vite lo detecta solo). SPA de una sola ruta, no hace falta configurar rewrites.

### Resetear el progreso

El progreso se guarda en `localStorage`. Para empezar de cero: abrir con
`?reset` en la URL (`http://localhost:5173/?reset`). El flag se consume y se
limpia de la barra de direcciones. También está la opción **"volver a empezar"**
dentro del menú del hongo (pide confirmación con un segundo tap).

### Saltar a una pantalla (dev)

`?screen=harley` (o `cassette`, `moon`, `final`) arranca en esa pantalla con las
anteriores dadas por resueltas. No se persiste; es sólo para iterar.

## Cómo está armado

- **Vite + React 18 + TS**, Tailwind 3 + componentes shadcn a mano
  (`src/components/ui/`: solo `button`, `input`, `dialog`, `card`, `progress`).
- **Estado**: `GameProvider` (`src/game/`) = context + `useReducer`. Guarda
  pantalla actual, puzzles resueltos y `solvedVia` (para distinguir el atajo del
  hongo en la pantalla 3). Persistencia en `localStorage` (`persistence.ts`,
  key versionada `facux:v1`). El estado intermedio de cada puzzle vive en el
  componente de la pantalla; sólo el flag `solved` cruza recargas.
- **Máquina de pantallas**: `SCREEN_ORDER` en `src/game/types.ts`. Cada pantalla
  es autocontenida en `src/screens/`, recibe `onSolved(via?)`. El avance lo
  maneja `App.tsx`: al resolver muestra `<SolvedInterstitial>` (el hongo con
  burbuja de cómic) y después dispara `GO_NEXT`. Transiciones con
  `AnimatePresence` + variants en `src/config/motion.ts`.
- **Hongo transversal**: `<MushroomHint>` (`src/components/`). Botón flotante con
  idle sutil; al tocarlo abre un menú (Dialog) con tres opciones:
  - **pista** → `<TrippyBackdrop>` a pantalla completa + panel opaco con la pista
    de esa pantalla. `wobble` deforma el texto (pantalla 1); `renderHint`
    reemplaza el panel entero (pantalla 4: el selector de fases lunares).
  - **consumir** → `<ConsumeTrip>`: el mismo fondo, más un hongo que crece
    cambiando de color hasta tapar la ventana. Al cumplirse `consumeDurationMs`
    todo se **congela** (`.trip-frozen` pausa las animaciones CSS y el canvas se
    detiene en el último fotograma) y aparece una **frase al azar** sobre un
    panel `.liquid-glass`; se sale con el botón. Las frases están en
    `copy.common.mushroom.quotes`. Configurable con `consumeGrowMs` /
    `consumeMaxScale` / `consumeOverlay`, y `onConsumeEnd` para el atajo de la
    pantalla 3 (10 s, con flor y hongos encima, y resuelve la pantalla).
    `consumeOverlay` es una función que recibe `{ frozen }` para poder detenerse
    junto con el resto.
  - **volver a empezar** → `RESET`, con confirmación en dos taps.

  Si no se le pasa `hint` ni `renderHint`, el menú aparece sin la opción "pista".
  Es el caso de la pantalla final, donde el hongo sólo ofrece "consumir" y
  "volver a empezar".

  El fondo psicodélico es `<TrippyBackdrop>` = `<TrippyCanvas>` (túnel de
  anillos, cuñas radiales y blobs espejados, en colores **fuera de la paleta**)
  envuelto en `.trip-hue` + `.trip-warp` (CSS, en `index.css`). Lo que se le pasa
  como children viaja dentro de los filtros; lo que tiene que quedar legible va
  como hermano, encima.
- **Copy**: todo en `src/content/copy.ts`. Editable sin tocar componentes.
- **Reduced motion**: `usePrefersReducedMotion` + branches por componente, más un
  kill-switch CSS en `index.css` como red de seguridad.

### Liquid glass

`.liquid-glass` (en `index.css`) es el material del panel de la frase. No es un
frosted plano: son tres capas — cuerpo poco desenfocado y muy saturado (se ve a
través), una **banda perimetral** con más blur y brillo que finge la refracción
del canto (`mask` + `mask-composite: exclude`), y un **reflejo especular** que lo
recorre. El ancho del canto se ajusta con la var `--lg-rim` (14px por defecto;
el botón usa 7px). El contenido directo se eleva con `z-index` porque los
pseudo-elementos se pintan después.

### Tipografía

DynaPuff (display) + Figtree (texto), self-hosted vía `@fontsource` (sin CDN en
runtime). Tokens Tailwind: `font-display`, `font-body`.

### Audio: howler

Se eligió **howler** sobre `<audio>` nativo por: unlock de autoplay en iOS/Safari
resuelto por la librería, control de volumen/fade, y pooling de instancias para
los SFX que se disparan seguido (el hongo de la pantalla 3, las patadas de la
moto). Con `<audio>` habría que reimplementar el unlock y el pooling a mano.
La música arranca en el primer gesto del usuario (requisito de iOS) y se puede
silenciar desde el botón de la esquina superior.

## Estado / pendiente

| Pantalla | Estado |
| --- | --- |
| 1 · Nombre | ✅ implementada |
| 2 · Harley | ✅ implementada (moto PNG puesta; faltan audios y logo definitivo) |
| 3 · Casete | ✅ implementada (falta audio de rebobinado) |
| 4 · Alpha Moon | ✅ implementada (falta audio del aullido) |
| 5 · Final | 🟡 maqueta con contenido placeholder desde `copy.ts` |

- Assets reales: ver `ASSETS.md`. Falta la moto, el logo, la imagen del regalo y
  todos los audios.
- La barra de progreso es informativa (no navegable). No hay navegación hacia atrás.
