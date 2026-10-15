// Production configuration. `ng serve` / development builds swap this file
// for environment.development.ts (see fileReplacements in angular.json).
export const environment = {
  // Public origin of the site, used for canonical and Open Graph URLs.
  siteUrl: 'https://d1a9c2zjj9rbbp.cloudfront.net',
  // Contact-form API: the `ApiUrl` output of the backend SAM stack
  // (portfolio-contact-api). Also allowed in the CSP connect-src.
  apiUrl: 'https://so4ac1fs4a.execute-api.eu-central-1.amazonaws.com',
};
