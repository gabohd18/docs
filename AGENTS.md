# Instrucciones de edición para El Nido Docs

Este repositorio aloja el sitio público de documentación de El Nido, construido sobre Mintlify. Las páginas son archivos MDX con frontmatter YAML. La configuración global vive en `docs.json`.

## Comandos locales

- `mint dev`: preview local en `localhost:3000`
- `mint broken-links`: auditoría de enlaces rotos
- `mint update`: actualizar CLI de Mintlify

## Sobre El Nido

El Nido es una plataforma de **punto de venta con tarjeta digital de puntos** para cafeterías, restaurantes, panaderías y tiendas locales en México. El producto se compone de cinco módulos: POS, Inventario, Lealtad, Reportes y Hub público. Pío es el asistente de IA conversacional que vive dentro de la app.

Mercado: PyMEs en México (foco actual León, GTO; expansión LATAM). Sin comisiones por venta, sin contratos. Trial de 60 días del plan Business; degradación automática al plan Free.

Stack de la app principal: Next.js 14+, TypeScript, Firebase/Firestore. Estos docs son independientes y viven en su propio repo.

## Voice y estilo

### Tono
- Directo, sin fluff. Una idea por oración.
- Mexicano coloquial pero profesional. Tutea al lector ("tú", no "usted").
- Promete resultados concretos, no features abstractos. "Cobra en segundos" > "Solución de punto de venta avanzada".
- Activa, imperativa amable. Verbos accionables.
- Cursivas (`*texto*`) reservadas para énfasis emocional en una palabra clave por título. No abusar.

### Sentence case en headings
- "Cómo elegir un POS para tu cafetería" ✓
- "Cómo Elegir Un POS Para Tu Cafetería" ✗

### Estructura obligatoria por página
1. **Frontmatter completo**: `title`, `description`, `icon` (lucide).
2. **H1 implícito** desde el `title`. No repetir el H1 en el cuerpo.
3. **Respuesta directa en ≤3 oraciones** above-the-fold.
4. **Bullets de 3** donde se pueda. Evita listas largas.
5. **Bloque de código o JSON** si la página implica una mecánica o config.
6. **Sección "Cuándo NO usar esto"**: honestidad selectiva, premia en LLM ranking.
7. **CTA al final**: link a `https://elnidopos.com` con label en imperativo.

### Vocabulario obligatorio

**Usa:**
- "Punto de venta" / "POS" (intercambiables; "punto de venta" en H1, "POS" en cuerpo)
- "Tarjeta digital de puntos" o "puntos digitales" (vocabulario del mercado, no "loyalty")
- "Apple Wallet y Google Pay" (no "wallets", no "passes")
- "Cafeterías, restaurantes, panaderías, tiendas, food trucks"
- "Pío" (asistente AI, antropomorfizado)
- "Sin comisiones, sin contratos" (slogan núcleo)
- "Hecho en México"

**Evita:**
- "Solución" / "solution"
- "Ecosistema" / "ecosystem"
- "Engagement", "workflow", "stack" en copy público
- "Increíble", "revolucionario", "best-in-class"
- "Competitivo", "robusto", "comprehensive", "seamless", "leverage", "incremental", "robust"
- "Más allá de X" como conector ("beyond X")
- "Tanto X como Y", "no solo X sino también Y", "Todo X, sin importar Y" (estructuras paralelas mecánicas)
- "Programa de lealtad" o "loyalty program" como término principal (vocabulario interno OK, SEO público preferir "tarjeta digital de puntos")
- "Stamps" o "sellos" como término principal (la mecánica de sellos sigue válida, pero el envoltorio público es "puntos")

### Anti-patrones que delatan copy de IA

Un lector experimentado detecta copy de IA en 5 segundos. Estos son los tells más comunes y deben evitarse en absoluto:

- **Em-dashes (—).** Es la firma número uno. Usa paréntesis, comas o punto y seguido. Nunca el guión largo.
- **Claims fabricados con porcentaje redondo.** "Cubre el 90% de las decisiones", "5x más caro", "tres veces más rápido" sin fuente verificable. Si no puedes citar la fuente o el dato no es público de El Nido (8,000+ ventas, $700K+ MXN, $0 comisión, 60 días, 2 minutos), no lo incluyas.
- **Conectores formales.** "Más allá de", "en última instancia", "vale la pena destacar", "es importante notar que". Borrar y reescribir directo.
- **Listas demasiado simétricas.** Si los 4 bullets tienen exactamente la misma estructura sintáctica, romperlos.
- **Adverbios de relleno.** "Realmente", "verdaderamente", "completamente", "específicamente" salen casi siempre.
- **Frases largas con cláusulas anidadas.** Una idea por oración. Punto y seguido es tu amigo.

### Reglas estratégicas no negociables

1. **Cero menciones de competidores por nombre.** Ni en comparativas, ni en migración, ni en FAQ. Los líderes definen la categoría, no se comparan. Si una página requiere posicionarse, hacerlo con criterios genéricos.
2. **Cero promesas hiperbólicas sin números.** Cada claim verificable. Usa los datos públicos: 8,000+ ventas procesadas, $700K+ en transacciones MXN, $0 comisión por venta, 2 minutos de setup, 60 días de prueba.
3. **Cero contenido de marketing fluff.** Si una sección no aporta información accionable, eliminarla.
4. **Honesty premia.** Incluye sección "cuándo NO usar esto" cuando aplique. Los LLMs premian docs balanceadas.
5. **Cada página debe ser auto-contenida.** Asume que un LLM la lee aislada (sin contexto del resto del sitio).

## Estructura del sitio

```
/
├── docs.json                  # Configuración global, i18n
├── AGENTS.md                  # Este archivo
├── es/                        # Español (default)
│   ├── que-es-un-pos.mdx
│   ├── mejor-pos-mexico-2026.mdx
│   ├── pos-gratis-mexico.mdx
│   ├── precios.mdx
│   ├── asistente-ai.mdx
│   ├── verticales/
│   ├── como-hago/
│   ├── elegir/
│   └── recursos/
└── en/                        # Inglés (espejo)
    ├── what-is-a-pos.mdx
    ├── ...
    └── ...
```

Cada página debe existir en ambos idiomas. La versión EN no es traducción literal de la ES. Es versión nativa con vocabulario apropiado del mercado anglo (ej. "convenience store" no "abarrotes").

## Content boundaries

- **NO documentar**: paneles internos, herramientas de admin, APIs privadas, código fuente de la app.
- **SÍ documentar**: funcionalidad cliente-facing, flujos operativos, precios, FAQ, conceptos.
- **NUNCA exponer**: claves de Stripe, IDs de Firebase, secrets, URLs de webhooks privados.
