# Instalar la app en tu celular (funciona sin internet)

Esta carpeta es una **PWA** (aplicación web instalable). Al abrirla una vez con internet,
el teléfono guarda todos los archivos (páginas, estilos, fuentes, íconos) y después
funciona **sin conexión**.

> Importante: una PWA solo se instala desde una dirección **HTTPS**. Si abres `index.html`
> directamente desde el celular o la computadora (`file://`) la página se ve, pero NO se
> instala ni se guarda para uso sin internet. Hay que publicarla primero (gratis).

## Paso 1. Publicarla gratis con GitHub Pages

1. Crea una cuenta en https://github.com y un repositorio nuevo **público** (por ejemplo `tutorial-movil`).
2. En el repositorio: **Add file → Upload files**. Arrastra el **contenido** de esta carpeta
   (`index.html`, `sw.js`, `manifest.webmanifest`, y las carpetas `css`, `js`, `pages`, `fonts`, `icons`, `images`)
   de modo que `index.html` quede en la raíz del repositorio. Pulsa **Commit changes**.
3. Ve a **Settings → Pages**. En *Source* elige **Deploy from a branch**, rama **main** y carpeta **/(root)**. Guarda.
4. Espera 1 o 2 minutos. Tu dirección será: `https://TU-USUARIO.github.io/tutorial-movil/`

(Otras opciones gratuitas con HTTPS que también sirven: Netlify, Cloudflare Pages, Vercel.)

## Paso 2. Instalarla en el celular

**Android (Chrome)**
1. Abre tu dirección con internet.
2. Toca el botón **Instalar** de la barra superior, o el menú ⋮ → **Instalar aplicación**.
3. Aparece el ícono en la pantalla de inicio. Ábrela una vez con conexión.

**iPhone (Safari)**
1. Abre tu dirección en Safari con internet.
2. Toca **Compartir** → **Añadir a pantalla de inicio**.

## Paso 3. Comprobar que funciona sin internet

Activa el **modo avión** y abre la app desde su ícono: deben abrir todos los módulos.
En la barra superior verás el aviso **Sin conexión**.

## Qué funciona sin internet y qué no

- Sí: los 7 módulos, las referencias, los ejemplos de código, el botón Copiar, los quizzes, el buscador y el cambio de tema.
- No: los enlaces a la documentación oficial y a YouTube (son páginas externas y requieren conexión).

## Actualizar el contenido

Si cambias algún archivo, vuelve a subirlo y regenera `sw.js` (o cambia el número `CACHE` dentro de `sw.js`).
El teléfono descargará la versión nueva la próxima vez que abras la app con internet.

## Probar en tu computadora (opcional)

Con Python instalado, dentro de esta carpeta:

    python -m http.server 8000

y abre http://localhost:8000 (`localhost` sí cuenta como seguro, así que el modo sin conexión se puede probar).
