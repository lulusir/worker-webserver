function getExt(url: string): string {
  const index = url.lastIndexOf(".");
  return index !== -1 ? url.substring(index + 1) : "";
}

function isIgnoreUrlExt(url: string) {
  const ignoreExt = ["js", "css", "jpg", "png"];
  const ext = getExt(url);
  return ignoreExt.includes(ext);
}

export function isHttpUrl(url: string): boolean {
  const pattern = /^(http|https):\/\//i;
  return pattern.test(url);
}
