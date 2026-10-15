# developer-portfolio

Personal portfolio site: Angular 21 (standalone components, NgRx, Angular Material 3). It is prerendered to static HTML at build time.

## Development
Requires Node 22 (see `.nvmrc`) and Yarn 1.

```bash
yarn install
yarn start                    # http://localhost:4200, uses environment.development.ts
yarn test --watch=false       # Vitest unit tests
yarn build                    # production build + prerender -> dist/developer-portfolio/browser
```

For the contact form to work locally, run the backend (`developer-portfolio-backend`) on port 3000.

## Content
All content (projects, skills, experience) lives in `src/data/*.data.ts`; there is no CMS.
- Images go in `public/`. Prefer WebP.
- Pages are prerendered at build time, so content changes need a rebuild.

## Configuration
`src/environments/environment.ts` holds the production settings:
- `apiUrl` is the contact-form API. Set it to the backend's `ApiUrl` output after deploying it to AWS.
- `siteUrl` is the public origin used for canonical and Open Graph URLs.

`environment.development.ts` replaces it for `ng serve` and development builds.

## Build output
`yarn build` runs `ng build` with `outputMode: "static"`, which produces:
- `<route>/index.html` for every route.
- `index.csr.html`, the client-rendered fallback used for unknown URLs (it shows the 404 page).

Then `scripts/csp-hashes.mjs` adds a per-page CSP `<meta>` tag that allows only that page's inline scripts, by hash. The hosting layer (CloudFront or Netlify) sends the rest of the CSP and the other security headers.

## Deploying to AWS (S3 + CloudFront)
1. Deploy the stack once, from any region:
   ```bash
   aws cloudformation deploy --template-file infra/template.yaml --stack-name portfolio-site \
     --parameter-overrides ApiOrigin=https://<api-id>.execute-api.<region>.amazonaws.com
   ```
   - For a custom domain, add `DomainName=... CertificateArn=...` (the ACM certificate must be in us-east-1).
2. Upload the site, either:
   - through the GitHub workflow: set the repository variables `SITE_BUCKET` and `DISTRIBUTION_ID` (stack outputs) and the secret `AWS_DEPLOY_ROLE_ARN`. The role is created by `deploy/github-oidc-role.yaml` in the backend repo. Pushes to `main` then test, build and deploy.
   - or manually, with the same `aws s3 sync` commands as `.github/workflows/deploy.yml`.
3. Add the site origin to the backend's `CORS_ORIGINS`.

`netlify.toml` stays valid until the move is complete.
