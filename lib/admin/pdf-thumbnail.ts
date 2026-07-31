/**
 * Renders page 1 of a PDF to a PNG, in the browser, at upload time.
 *
 * Doing this client-side keeps a native rasteriser off the server (they are
 * awkward on serverless) and means the card grid only ever loads a plain image
 * — no embedded PDF viewer, and nothing that the app's `object-src 'none'`
 * Content-Security-Policy would block.
 *
 * pdf.js is imported dynamically so its ~350KB only loads on the certificate
 * form, never on the pages that merely display the result.
 */

/** Longest edge of the generated thumbnail, in CSS pixels. */
const MAX_EDGE = 1000

export class PdfThumbnailError extends Error {}

export async function renderPdfFirstPage(file: Blob): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new PdfThumbnailError('PDF rendering is browser-only.')
  }

  const pdfjs = await import('pdfjs-dist')

  // Served from /public so it satisfies the CSP's 'self' script source; a CDN
  // worker would be blocked. Kept in step with the installed pdfjs-dist version
  // by scripts/sync-pdf-worker.mjs, which runs on postinstall.
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

  const data = await file.arrayBuffer()
  // `destroy()` lives on the loading task, not the document proxy (pdfjs v6).
  const loadingTask = pdfjs.getDocument({ data })
  const doc = await loadingTask.promise

  try {
    const page = await doc.getPage(1)

    const base = page.getViewport({ scale: 1 })
    const scale = Math.min(MAX_EDGE / Math.max(base.width, base.height), 2)
    const viewport = page.getViewport({ scale })

    const canvas = document.createElement('canvas')
    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)

    const context = canvas.getContext('2d')
    if (!context) throw new PdfThumbnailError('Could not get a 2D canvas context.')

    // PDFs assume paper; without this, transparent areas render black.
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)

    await page.render({ canvas, canvasContext: context, viewport }).promise

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    )
    if (!blob) throw new PdfThumbnailError('Could not encode the preview image.')

    return blob
  } finally {
    // Frees the worker and aborts any in-flight work for this document.
    await loadingTask.destroy()
  }
}
