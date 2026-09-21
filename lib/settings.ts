export const PUBLIC_SETTING_KEYS = [
  'siteName', 'siteTitle', 'siteDescription', 'siteKeywords', 'heroSubheadline',
  'copyrightText', 'availability', 'availableForWork', 'contactEmail',
] as const
export const SECRET_SETTING_KEYS = ['nvidiaNimKey', 'googleAiKey', 'openRouterKey'] as const
export const SECRET_MASK = '********'
export function isSecretSetting(key: string) {
  return (SECRET_SETTING_KEYS as readonly string[]).includes(key)
}
export function maskSettings(settings: { key: string; value: unknown }[]) {
  return Object.fromEntries(settings.map(({ key, value }) => [key, isSecretSetting(key) && value ? SECRET_MASK : value]))
}
