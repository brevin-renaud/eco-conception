/**
 * Éco-conception — résolution des URLs d'images.
 *
 * Les images sont servies EN DIRECT depuis un bucket objet + CDN (S3, R2, GCS…),
 * jamais proxifiées par le backend Node : on évite ainsi un double transfert et
 * on conserve le cache HTTP du CDN + l'optimisation next/image (AVIF/WebP).
 *
 * En local (variable non définie), on retombe sur les fichiers de /public.
 * Configure NEXT_PUBLIC_IMAGE_CDN dans .env pour pointer vers le bucket, ex :
 *   NEXT_PUBLIC_IMAGE_CDN=https://mon-bucket.r2.dev
 */
const CDN_BASE = process.env.NEXT_PUBLIC_IMAGE_CDN?.replace(/\/$/, "") ?? "";

export function toImageUrl(path: string): string {
  // Déjà une URL absolue → on ne touche pas.
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return CDN_BASE ? `${CDN_BASE}${normalized}` : normalized;
}
