/** HTML parsers recognize closing script tags even inside JSON strings. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
