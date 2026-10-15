import { inject, Injectable, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { environment } from '../../environments/environment';

export const SITE_NAME = 'Mohamed Abdelazim';
const DEFAULT_DESCRIPTION =
  'Mohamed Abdelazim — software engineer. Projects, skills, experience and articles.';

/**
 * Sets `<title>`, the meta description, Open Graph tags and the canonical
 * link from each route's `title` and `data.description`.
 * Pages whose content is only known at runtime can call `SeoService.update`
 * directly; such routes set `data: { dynamicSeo: true }` to be skipped here.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(pageTitle: string | undefined, description: string | undefined, path: string): void {
    const fullTitle = pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME;
    const desc = description || DEFAULT_DESCRIPTION;
    const url = `${environment.siteUrl}${path.split(/[?#]/)[0]}`;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: desc });
    this.setCanonical(url);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }
}

@Injectable({ providedIn: 'root' })
export class SeoTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route: ActivatedRouteSnapshot = snapshot.root;
    while (route.firstChild) route = route.firstChild;
    if (route.data['dynamicSeo']) return;
    this.seo.update(this.buildTitle(snapshot), route.data['description'], snapshot.url);
  }
}
