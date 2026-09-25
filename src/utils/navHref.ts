// Section anchors (e.g. "#products") only exist on the home page. From any
// other page, resolve them to an absolute "/#products" link instead so they
// navigate back home before jumping to the section; real paths like
// "/affiliate" pass through unchanged. The top of the home page is just "/",
// so "#top" resolves to a plain "/" (keeping any ?ref= tracking parameter)
// rather than "/#top".
export function resolveNavHref(href: string): string {
  if (!href.startsWith('#')) return href;
  if (window.location.pathname === '/') return href;
  return href === '#top' ? `/${window.location.search}` : `/${href}`;
}
