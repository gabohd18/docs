# Robot de capturas para la documentación

Reemplaza a Scribe. Genera las capturas de un flujo de la app automáticamente y las deja
listas para la documentación, sin límites ni suscripción.

## Instalación (una sola vez)

```bash
cd el-nido-docs/tooling
npm install
npx playwright install chromium
```

## Iniciar sesión (una sola vez, o cuando expire)

```bash
npm run login
```

Se abre un navegador. Inicia sesión con tu cuenta de dueño, y cuando estés dentro del panel,
regresa a la terminal y presiona ENTER. Se guarda tu sesión en `auth.json`
(no se sube a git; tu contraseña nunca se guarda, solo la cookie de sesión).

## Generar las capturas de un flujo

```bash
npm run shot restock
```

Genera las capturas de `recipes/restock.mjs` en `../images/es/restock/`, retina y listas para el MDX.

Para ver el navegador mientras corre (debug): `npm run shot restock --headed`.

## Agregar un flujo nuevo

Crea `recipes/<nombre>.mjs` copiando `restock.mjs`. Cada paso puede hacer:

| Campo | Qué hace |
|-------|----------|
| `goto: '/products'` | Navega a una ruta (o URL completa). |
| `waitFor: { text: 'Productos' }` | Espera a que algo sea visible antes de seguir. |
| `click: { role: 'menuitem', name: 'Agregar Restock' }` | Da clic. Acepta `{ text }`, `{ role, name }`, `{ label }`, `{ placeholder }` o un selector CSS/text. |
| `fill: { field: { label: 'Cantidad' }, value: 24 }` | Escribe en un campo. |
| `press: 'Enter'` | Presiona una tecla. |
| `shot: '01-menu'` | Toma una captura del viewport (diálogo sobre la página). |
| `shotOf: '[role=dialog]'` | (Opcional) recorta la captura a un elemento. |
| `settle: 800` | (Opcional) ms de espera para animaciones antes de capturar. |

Luego solo dime "documenta el flujo X" y yo corro el robot + escribo la página.

## Nota importante

Las capturas se toman de **producción** (`elnidopos.com`), así que reflejan lo que ve el cliente.
Si el UI cambia, vuelve a correr `npm run shot <flujo>` y las imágenes se regeneran actualizadas.
