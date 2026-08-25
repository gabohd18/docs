// Robot de capturas para la documentación de El Nido.
// Reemplaza a Scribe: lee una "receta" (data) y genera las capturas del flujo.
//
// Uso:
//   npm run login              → inicia sesión una vez y guarda la sesión (auth.json)
//   npm run shot <receta>      → genera las capturas de recipes/<receta>.mjs
//   npm run shot <receta> --headed   → ver el navegador mientras corre (debug)
//
// Las capturas se guardan en ../images/<lang>/<topic>/ listas para el MDX.

import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const AUTH_FILE = join(__dirname, 'auth.json')
const IMAGES_ROOT = resolve(__dirname, '..', 'images')

const args = process.argv.slice(2)
const isLogin = args.includes('--login')
const headed = args.includes('--headed')
const recipeName = args.find((a) => !a.startsWith('--'))

const DEFAULT_BASE_URL = 'https://elnidopos.com'

// --- Login: abre el navegador, tú inicias sesión, se guarda la sesión ------
async function doLogin() {
  const baseURL = process.env.DOCS_BASE_URL || DEFAULT_BASE_URL
  console.log('\n🔑  Abriendo el navegador. Inicia sesión con tu cuenta de dueño.')
  console.log('    Cuando ya estés DENTRO (viendo el panel), regresa aquí y presiona ENTER.\n')
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  await page.goto(baseURL)

  await new Promise((res) => {
    process.stdin.resume()
    process.stdin.once('data', () => res())
  })

  await context.storageState({ path: AUTH_FILE })
  await browser.close()
  console.log(`\n✅  Sesión guardada en auth.json. Ya puedes correr: npm run shot <receta>\n`)
  process.exit(0)
}

// --- Convierte un "spec" de la receta en un locator de Playwright ----------
function locate(page, spec) {
  if (typeof spec === 'string') return page.locator(spec) // selector CSS/text de Playwright
  if (spec.text) return page.getByText(spec.text, { exact: spec.exact ?? false })
  if (spec.role) return page.getByRole(spec.role, { name: spec.name, exact: spec.exact ?? false })
  if (spec.label) return page.getByLabel(spec.label, { exact: spec.exact ?? false })
  if (spec.placeholder) return page.getByPlaceholder(spec.placeholder)
  if (spec.testId) return page.getByTestId(spec.testId)
  throw new Error(`Spec de locator no reconocido: ${JSON.stringify(spec)}`)
}

// --- Ejecuta una receta ----------------------------------------------------
async function runRecipe() {
  if (!recipeName) {
    console.error('Falta el nombre de la receta. Ej: npm run shot restock')
    process.exit(1)
  }
  const recipePath = join(__dirname, 'recipes', `${recipeName}.mjs`)
  if (!existsSync(recipePath)) {
    console.error(`No existe la receta: recipes/${recipeName}.mjs`)
    process.exit(1)
  }
  if (!existsSync(AUTH_FILE)) {
    console.error('No hay sesión guardada. Corre primero: npm run login')
    process.exit(1)
  }

  const { default: recipe } = await import(recipePath)
  const lang = recipe.lang || 'es'
  const outDir = join(IMAGES_ROOT, lang, recipe.topic)
  await mkdir(outDir, { recursive: true })

  const baseURL = process.env.DOCS_BASE_URL || recipe.baseURL || DEFAULT_BASE_URL
  const viewport = recipe.viewport || { width: 1440, height: 900 }

  const browser = await chromium.launch({ headless: !headed })
  const context = await browser.newContext({
    storageState: AUTH_FILE,
    viewport,
    deviceScaleFactor: 2, // capturas retina, nítidas
  })
  const page = await context.newPage()

  console.log(`\n📸  Receta "${recipeName}" → ${outDir}`)

  let shotCount = 0
  for (const [i, step] of recipe.steps.entries()) {
    const tag = `  [${i + 1}/${recipe.steps.length}]`
    try {
      if (step.goto) {
        const url = step.goto.startsWith('http') ? step.goto : baseURL + step.goto
        await page.goto(url, { waitUntil: 'networkidle' })
      }
      if (step.waitFor) await locate(page, step.waitFor).first().waitFor({ state: 'visible', timeout: 15000 })
      if (step.click) await locate(page, step.click).first().click()
      if (step.fill) await locate(page, step.fill.field).first().fill(String(step.fill.value))
      if (step.press) await page.keyboard.press(step.press)
      // pausa para que terminen animaciones (menús/diálogos de Radix)
      await page.waitForTimeout(step.settle ?? 500)

      if (step.shot) {
        const file = join(outDir, `${step.shot}.png`)
        if (step.shotOf) {
          await locate(page, step.shotOf).first().screenshot({ path: file })
        } else {
          await page.screenshot({ path: file }) // viewport (estilo Scribe: diálogo sobre página)
        }
        shotCount++
        console.log(`${tag} 📷 ${step.shot}.png`)
      } else {
        console.log(`${tag} ✓`)
      }
    } catch (err) {
      console.error(`${tag} ❌ ${err.message}`)
      const debugFile = join(outDir, `_error-step-${i + 1}.png`)
      await page.screenshot({ path: debugFile }).catch(() => {})
      await browser.close()
      process.exit(1)
    }
  }

  await browser.close()
  console.log(`\n✅  ${shotCount} capturas generadas en ${outDir}\n`)
}

if (isLogin) await doLogin()
else await runRecipe()
