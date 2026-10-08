const onHome = () => typeof window === "undefined" || /^\/(index\.html)?$/.test(window.location.pathname);

/** "#section" links point back to the homepage when rendered on a subpage */
export function homeLink(hash: string) {
  if (onHome()) return hash;
  return hash === "#top" ? "/" : `/${hash}`;
}
