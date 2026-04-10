/**
 * Normalizes Next/webpack static file imports for `<img src>` and `url(...)`.
 * The bundler may provide either a string URL or a `{ src: string }` object.
 */
export function staticImportSrc(mod: string | { src: string }): string {
  return typeof mod === "string" ? mod : mod.src;
}
