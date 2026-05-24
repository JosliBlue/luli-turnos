import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SITE, SITE_URL } from '@src/site.config';

@Injectable({ providedIn: 'root' })
export class SeoService {
    private readonly title = inject(Title);
    private readonly meta = inject(Meta);

    public applyDefaults(): void {
        this.title.setTitle(SITE.title);

        this.meta.updateTag({ name: 'description', content: SITE.description });
        this.meta.updateTag({ property: 'og:title', content: SITE.title });
        this.meta.updateTag({ property: 'og:description', content: SITE.description });
        this.meta.updateTag({ property: 'og:url', content: `${SITE_URL}/` });
        this.meta.updateTag({
            property: 'og:image',
            content: `${SITE_URL}${SITE.ogImage}`,
        });
        this.meta.updateTag({ name: 'twitter:title', content: SITE.title });
        this.meta.updateTag({ name: 'twitter:description', content: SITE.description });
        this.meta.updateTag({
            name: 'twitter:image',
            content: `${SITE_URL}${SITE.ogImage}`,
        });
    }
}
