// Receta: registrar un restock (entrada de inventario).
// Reproduce el flujo que antes grabábamos en Scribe.
//
// Cada paso puede: goto, waitFor, click, fill, press, y tomar una captura (shot).
// - Los selectores pueden ser: string CSS/text de Playwright, o { text }, { role, name }, { label }, { placeholder }.
// - shot: nombre del archivo (sin .png). Por defecto captura el viewport (diálogo sobre la página, estilo Scribe).
// - shotOf: si quieres recortar a un elemento (ej. solo el diálogo).

export default {
  topic: 'restock', // → images/es/restock/
  lang: 'es',
  viewport: { width: 1440, height: 900 },
  steps: [
    // 1. Entrar a Productos
    { goto: '/products', waitFor: { text: 'Productos' } },

    // 2. Abrir el menú de acciones del primer producto y capturar "Agregar Restock"
    { click: 'button[aria-label^="Abrir menú"]', shot: '01-menu-agregar-restock' },

    // 3. Abrir el diálogo de restock y capturarlo
    { click: { role: 'menuitem', name: 'Agregar Restock' }, shot: '02-dialogo-restock' },
  ],
}
