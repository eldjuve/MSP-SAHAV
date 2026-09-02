import DOMPurify from 'dompurify';

// InfoSidebar renders GeoServer's own Abstract text and ChartData's
// about/subpara fields as HTML (they carry real markup — <br/>, <b>, links).
// Both are meant to be admin-authored and trusted today, but neither this
// app nor GeoServer itself enforces that — sanitize before it ever reaches
// innerHTML rather than relying on that assumption holding forever.
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html);
}
