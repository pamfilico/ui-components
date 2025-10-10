/**
 * SEO Utilities for ui-components server components
 * Provides helpers for generating metadata from server component data
 */

import { Metadata } from 'next';

interface SeoData {
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  title?: string;
  description?: string;
}

/**
 * Generates Next.js metadata from SEO data
 * Falls back to title/description if SEO fields are not provided
 */
export function generateMetadataFromSeo(
  data: SeoData,
  defaults?: {
    titleSuffix?: string;
    siteName?: string;
  }
): Metadata {
  const title = data.seo_title || data.title;
  const description = data.seo_description || data.description;
  const keywords = data.seo_keywords;

  const fullTitle = title && defaults?.titleSuffix
    ? `${title} ${defaults.titleSuffix}`
    : title;

  return {
    title: fullTitle,
    description,
    keywords,
    openGraph: {
      title: fullTitle,
      description,
      siteName: defaults?.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };
}

/**
 * Extracts SEO data from an array of items (e.g., features, FAQs)
 * Useful for collection pages
 */
export function extractCollectionSeo(
  items: SeoData[],
  defaults: {
    title: string;
    description: string;
    titleSuffix?: string;
    siteName?: string;
  }
): Metadata {
  // Use the first item's SEO data if available, otherwise use defaults
  const firstItem = items[0];
  const keywords = items
    .map(item => item.seo_keywords)
    .filter(Boolean)
    .join(', ');

  const title = defaults.titleSuffix
    ? `${defaults.title} ${defaults.titleSuffix}`
    : defaults.title;

  return {
    title,
    description: firstItem?.seo_description || defaults.description,
    keywords: keywords || undefined,
    openGraph: {
      title,
      description: firstItem?.seo_description || defaults.description,
      siteName: defaults.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: firstItem?.seo_description || defaults.description,
    },
  };
}

/**
 * Generates structured data (JSON-LD) for FAQ pages
 */
export function generateFaqStructuredData(faqs: Array<{ title: string; description: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.description,
      },
    })),
  };
}

/**
 * Generates structured data (JSON-LD) for features/product info
 */
export function generateFeatureStructuredData(
  features: Array<{ title: string; description: string }>,
  productName?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: features.map(f => f.title).join(', '),
    featureList: features.map(f => f.title),
  };
}
