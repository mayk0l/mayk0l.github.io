const seoData = {
  title: 'Maykol Salgado - Desarrollador Fullstack | React, TypeScript, Node.js',
  description: 'Maykol Salgado, desarrollador de software fullstack especializado en React, TypeScript, Node.js y PostgreSQL. Creo soluciones modernas y eficientes para pymes y startups en Chile y LATAM.',
  keywords: 'Maykol Salgado, maykol salgado, maykolsalgado, desarrollador fullstack, react, typescript, nodejs, postgresql, chile, software para pymes, desarrollador chile, programador fullstack, astro, tailwindcss, maykol nicolás salgado, maykol nicolas salgado',
  author: 'Maykol Salgado',
  url: 'https://maykolsalgado.me',
  image: 'https://maykolsalgado.me/images/og-maykol-salgado.svg',
  type: 'website',
  siteName: 'Maykol Salgado - Desarrollador Fullstack',
  locale: 'es_CL',
  twitterHandle: '@mayk0ldev'
};

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
  canonical?: string;
}

export function generateSEOTags(props: SEOProps = {}) {
  const {
    title = seoData.title,
    description = seoData.description,
    keywords = seoData.keywords,
    image = seoData.image,
    url = seoData.url,
    type = seoData.type,
    noindex = false,
    canonical = url
  } = props;

  return {
    title,
    description,
    keywords,
    image,
    url,
    type,
    noindex,
    canonical,
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    ogTags: {
      'og:type': type,
      'og:url': url,
      'og:title': title,
      'og:description': description,
      'og:image': image,
      'og:site_name': seoData.siteName,
      'og:locale': seoData.locale
    },
    twitterTags: {
      'twitter:card': 'summary_large_image',
      'twitter:site': seoData.twitterHandle,
      'twitter:creator': seoData.twitterHandle,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image
    }
  };
}

export function generateStructuredData(type: 'Person' | 'WebPage' | 'Article' | 'BreadcrumbList', data: any) {
  const baseStructuredData = {
    '@context': 'https://schema.org'
  };

  switch (type) {
    case 'Person':
      return {
        ...baseStructuredData,
        '@type': 'Person',
        name: 'Maykol Salgado',
        alternateName: ['Maykol Nicolás Salgado', 'Maykol Nicolas Salgado', 'maykolsalgado'],
        jobTitle: 'Desarrollador Fullstack',
        description: 'Maykol Salgado, desarrollador de software especializado en React, TypeScript, Node.js y PostgreSQL',
        url: 'https://maykolsalgado.me',
        sameAs: [
          'https://github.com/mayk0l',
          'https://linkedin.com/in/maykol-nicolas-salgado-ramos-788366371',
          'https://twitter.com/mayk0ldev'
        ],
        knowsAbout: [
          'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'JavaScript', 
          'Web Development', 'Fullstack Development', 'Software Engineering'
        ],
        workLocation: {
          '@type': 'Place',
          name: 'Chile'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'maykol@maykolsalgado.me',
          contactType: 'professional'
        },
        ...data
      };

    case 'WebPage':
      return {
        ...baseStructuredData,
        '@type': 'WebPage',
        name: data.title || seoData.title,
        description: data.description || seoData.description,
        url: data.url || seoData.url,
        inLanguage: 'es-CL',
        isPartOf: {
          '@type': 'WebSite',
          name: seoData.siteName,
          url: seoData.url
        },
        author: {
          '@type': 'Person',
          name: 'Maykol Salgado'
        },
        ...data
      };

    case 'Article':
      return {
        ...baseStructuredData,
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        author: {
          '@type': 'Person',
          name: 'Maykol Salgado',
          url: 'https://maykolsalgado.me'
        },
        publisher: {
          '@type': 'Person',
          name: 'Maykol Salgado',
          url: 'https://maykolsalgado.me'
        },
        datePublished: data.publishDate,
        dateModified: data.modifiedDate || data.publishDate,
        image: data.image || seoData.image,
        url: data.url,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url
        },
        ...data
      };

    case 'BreadcrumbList':
      return {
        ...baseStructuredData,
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      };

    default:
      return baseStructuredData;
  }
}

export default seoData;
