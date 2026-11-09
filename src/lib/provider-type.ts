export type ProviderType = "INTERNAL" | "EXTERNAL";

/** Todo técnico sin `provider_type` explícito se trata como interno. */
export function normalizeProviderType(
  value: string | null | undefined
): ProviderType {
  return value === "EXTERNAL" ? "EXTERNAL" : "INTERNAL";
}

/** Etiqueta larga en español para formularios. */
export function providerTypeLabel(value: string | null | undefined): string {
  return normalizeProviderType(value) === "EXTERNAL"
    ? "Proveedor Externo"
    : "Acelera";
}

/** Etiqueta corta del badge: [ACELERA] interno, [EXT] externo. */
export function providerBadgeTag(value: string | null | undefined): string {
  return normalizeProviderType(value) === "EXTERNAL" ? "EXT" : "ACELERA";
}

export function providerBadgeClassName(
  value: string | null | undefined
): string {
  return normalizeProviderType(value) === "EXTERNAL"
    ? "border-blue-300 text-blue-700 dark:border-blue-900 dark:text-blue-400"
    : "border-red-300 text-red-600 dark:border-red-900 dark:text-red-400";
}
