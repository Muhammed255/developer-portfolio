import { RenderMode, ServerRoute } from '@angular/ssr';

// Everything is prerendered to static HTML at build time (outputMode
// "static"), so the site can be served straight from S3/CloudFront.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
