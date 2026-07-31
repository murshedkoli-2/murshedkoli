/**
 * Copies the pdf.js worker into /public.
 *
 * The certificate form renders page 1 of an uploaded PDF to a PNG in the
 * browser. pdf.js needs its worker at a URL, and the app's CSP only allows
 * scripts from 'self' — so the worker has to be served from our own origin
 * rather than a CDN. Running this on postinstall keeps the copy in step with
 * whatever version of pdfjs-dist is installed.
 */
import { copyFile, mkdir, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs')
const target = join(root, 'public', 'pdf.worker.min.mjs')

try {
  await stat(source)
} catch {
  console.warn('[sync-pdf-worker] pdfjs-dist not installed; skipping.')
  process.exit(0)
}

await mkdir(dirname(target), { recursive: true })
await copyFile(source, target)
console.log('[sync-pdf-worker] public/pdf.worker.min.mjs updated.')
