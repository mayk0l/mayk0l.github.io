const seoData = {
  title: 'Maykol Salgado - Desarrollador Full Stack Chile | Sistemas Empresariales React Node.js TypeScript',
  description: 'Maykol Salgado, desarrollador full stack especializado en sistemas empresariales para PYMEs Chile. Desarrollo aplicaciones React, TypeScript, Node.js, PostgreSQL. Soluciones CMS personalizados, APIs escalables y consultoría técnica para empresas LATAM.',
  keywords: 'Maykol Salgado, desarrollador full stack chile, sistemas empresariales, aplicaciones react typescript, node.js postgresql, CMS personalizado, APIs escalables, consultoría técnica, desarrollo pymes chile, soluciones empresariales latam, arquitecto software, programador fullstack',
  author: 'Maykol Salgado',
  url: 'https://maykolsalgado.me',
  image: 'https://maykolsalgado.me/images/og-maykol-salgado.svg',
  type: 'website',
  siteName: 'Maykol Salgado - Desarrollador Full Stack Empresarial',
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

export function generateStructuredData(type: 'Person' | 'WebPage' | 'Article' | 'BreadcrumbList' | 'Organization', data: any) {
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

    case 'Organization':
      return {
        ...baseStructuredData,
        '@type': 'Organization',
        name: 'Maykol Salgado - Desarrollador Full Stack',
        alternateName: ['Maykol Salgado', 'maykolsalgado', 'Maykol Nicolás Salgado'],
        description: 'Desarrollador full stack especializado en sistemas empresariales para PYMEs Chile',
        url: 'https://maykolsalgado.me',
        logo: {
          '@type': 'ImageObject',
          url: 'https://maykolsalgado.me/logo.svg',
          width: 512,
          height: 512,
          caption: 'Maykol Salgado Logo'
        },
        image: {
          '@type': 'ImageObject',
          url: 'https://maykolsalgado.me/images/og-maykol-salgado.svg',
          width: 1200,
          height: 630,
          caption: 'Maykol Salgado - Desarrollador Full Stack'
        },
        founder: {
          '@type': 'Person',
          name: 'Maykol Salgado'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'maykol@maykolsalgado.me',
          contactType: 'customer service',
          areaServed: ['CL', 'LATAM'],
          availableLanguage: ['Spanish', 'English']
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'CL',
          addressRegion: 'Chile'
        },
        sameAs: [
          'https://github.com/mayk0l',
          'https://linkedin.com/in/maykol-nicolas-salgado-ramos-788366371',
          'https://twitter.com/mayk0ldev'
        ],
        knowsAbout: [
          'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'JavaScript', 
          'Web Development', 'Fullstack Development', 'Software Engineering',
          'Enterprise Systems', 'CMS Development', 'API Development'
        ],
        ...data
      };

    default:
      return baseStructuredData;
  }
}

export default seoData;
