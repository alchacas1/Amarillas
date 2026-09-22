# Flores amarillas

Experiencia interactiva hecha con Next.js: una flor crece, aparecen mensajes, llueven flores amarillas y al final se reproduce música.

## Requisitos

- Node.js 22.13 o superior (también funciona con Node 24 o 26+)
- npm

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Verificaciones

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

## Ejecutar la versión de producción

```bash
npm run build
npm start
```

La aplicación queda disponible en [http://localhost:3000](http://localhost:3000).

## Estructura principal

- `src/app/page.tsx`: coordina las etapas de la experiencia.
- `src/components/PlantGrowthAnimation.tsx`: introducción del crecimiento.
- `src/components/ClickButtons.tsx`: secuencia de mensajes y partículas.
- `src/components/YellowFlowers.tsx`: lluvia y movimiento de flores.
- `src/components/FallingPetalsBackground.tsx`: pétalos finales animados con CSS.
