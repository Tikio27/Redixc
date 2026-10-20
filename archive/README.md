# Archivo

Archivos que el sitio ya no usa, conservados como referencia. Nada de esta carpeta se compila, se publica ni se analiza con lint (`.eslintrc.cjs` la ignora). Cada archivo mantiene su ruta original debajo de `archive/`.

| Ruta | Qué es |
|---|---|
| `demos/redesign` | Demo original del rediseño (Vite, worker y scripts de hosting). El sitio vive en `src/site`. |
| `src/components` | Componentes del sitio anterior. |
| `src/assets/hero`, `src/assets/redixc`, `src/assets/fonts` | Imágenes y fuente Argon del sitio anterior. |
| `public/assets` | Variantes de hero y logos que el rediseño no usa. |
| `public/assets/community` | Fotos de comunidad sustituidas; su procedencia sigue en `src/site/community-sources.md`. |
| `public/logoNoBgWhite.webp`, `public/logo_bg.svg` | Logos del sitio anterior. |
| `docs/superpowers/plans` | Plan del rediseño de claridad, ya ejecutado. |

Para recuperar un archivo, muévelo de vuelta a su ruta original y referencia su uso en el sitio: `src/site/public-files.test.mjs` falla si `public/` contiene archivos sin uso.
