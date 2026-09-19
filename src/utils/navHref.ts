// Section anchors (e.g. "#products") only exist on the home page. From any
// other page, resolve them to an absolute "/#products" link instead so they
// navigate back home before jumping to the section; real paths like
// "/affiliate" pass through unchanged.
export function resolveNavHref(href: string): string {
  if (!href.startsWith('#')) return href;
  return window.location.pathname === '/' ? href : `/${href}`;
}
