# Agenda Contador Público — Instrucciones de instalación

## Archivos incluidos

```
agenda-contador/
├── index.html       ← App principal
├── sw.js            ← Service Worker (notificaciones push)
├── manifest.json    ← Configuración PWA (icono, nombre, etc.)
└── README.md        ← Este archivo
```

---

## Paso 1 — Crear cuenta en GitHub (si no tenés)

1. Entrá a https://github.com
2. Hacé clic en **Sign up**
3. Completá el registro (es gratuito)

---

## Paso 2 — Crear el repositorio

1. Una vez dentro de GitHub, hacé clic en el botón verde **New** (arriba a la izquierda)
2. En **Repository name** escribí: `agenda-contador`
3. Dejalo en **Public** (necesario para GitHub Pages gratuito)
4. Hacé clic en **Create repository**

---

## Paso 3 — Subir los archivos

### Opción A — Desde el navegador (más fácil)

1. En la página del repositorio recién creado, hacé clic en **uploading an existing file**
2. Arrastrá o seleccioná los 3 archivos: `index.html`, `sw.js`, `manifest.json`
3. Abajo en **Commit changes** escribí algo como: `primera versión`
4. Hacé clic en **Commit changes**

### Opción B — Desde la terminal (si sabés usar Git)

```bash
git clone https://github.com/TU_USUARIO/agenda-contador.git
cd agenda-contador
# copiá los archivos acá
git add .
git commit -m "primera versión"
git push origin main
```

---

## Paso 4 — Activar GitHub Pages

1. En el repositorio, hacé clic en **Settings** (pestaña arriba)
2. En el menú izquierdo, hacé clic en **Pages**
3. En **Source** seleccioná **Deploy from a branch**
4. En **Branch** elegí `main` y la carpeta `/ (root)`
5. Hacé clic en **Save**
6. Esperá 1-2 minutos y GitHub te va a mostrar el link:

   ```
   https://TU_USUARIO.github.io/agenda-contador/
   ```

---

## Paso 5 — Instalar en el celular

### Android (Chrome)
1. Abrí el link en Chrome
2. Tocá los 3 puntitos (⋮) arriba a la derecha
3. **Agregar a pantalla de inicio**
4. Confirmá — queda como ícono de app

### iOS (Safari)
1. Abrí el link en Safari
2. Tocá el botón compartir (□↑) abajo
3. **Agregar a pantalla de inicio**
4. Confirmá

---

## Paso 6 — Activar notificaciones

1. Abrí la app desde el ícono en tu pantalla de inicio
2. En la pantalla de Inicio vas a ver un banner azul: **"Activar notificaciones de vencimientos"**
3. Tocalo y aceptá el permiso
4. Listo — a partir de ahí vas a recibir alertas:
   - El **día anterior** a un vencimiento (impuestos + tareas con recordatorio)
   - El **día del vencimiento**

> **Nota:** Las notificaciones solo funcionan si la app está instalada como PWA (desde "Agregar a pantalla de inicio") y abierta al menos una vez al día. Para notificaciones en segundo plano completas en Android, Chrome las admite bien. En iOS 16.4+ Safari también las soporta.

---

## Iconos (opcional)

La carpeta no incluye imágenes de íconos (`icon-192.png`, `icon-512.png`).
La app funciona igual, pero si querés un ícono bonito en la pantalla de inicio:

1. Entrá a https://favicon.io/favicon-generator/
2. Escribí "CP", elegí fondo azul (#185FA5) y letras blancas
3. Descargá y subí al repositorio los archivos `android-chrome-192x192.png` y `android-chrome-512x512.png`
4. Renombralos a `icon-192.png` e `icon-512.png`

---

## Actualizar la app

Si en el futuro necesitás actualizar (nuevas funciones, etc.):
1. Reemplazá `index.html` en el repositorio
2. GitHub Pages se actualiza solo en unos minutos
3. Al abrir la app en el celular, el Service Worker descarga la versión nueva automáticamente

---

## Soporte

- Datos guardados: en el celular (localStorage), no se pierden al cerrar
- Funciona sin internet (excepto links externos a ARCA, API SF, etc.)
- Compatible con Android (Chrome 80+) e iOS (Safari 16.4+)
