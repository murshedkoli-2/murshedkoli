export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'portfolio-theme'

/**
 * Runs before paint (injected inline in <head>) to set data-theme on the
 * document element, avoiding a flash of the wrong theme on first load.
 * Default is strictly 'light' (Apple studio aesthetic), honoring 'dark'
 * only if the user explicitly toggled it in localStorage.
 */
export const themeInitScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var s=localStorage.getItem(k);var t=s==='dark'?'dark':'light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`
