const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function publicPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (basePath && (path === basePath || path.startsWith(`${basePath}/`))) return path;
  return `${basePath}${path}`;
}

export function rewritePublicPaths(html: string) {
  if (!basePath) return html;
  return html.replace(/\b(src|href)=(['"])(\/(?!\/)[^'"]*)\2/g, (_match, attribute, quote, path) => `${attribute}=${quote}${publicPath(path)}${quote}`);
}
