import React from "react";
import { DynamicUsagePricingComponentVariant1 } from "./DynamicUsagePricingComponentVariant1";
import { DynamicUsagePricingComponentVariant2 } from "./DynamicUsagePricingComponentVariant2";
import type { PricingConfig, Resource, Resources } from "./DynamicUsagePricingComponentVariant1";

interface DynamicUsagePricingParentConfig {
  en: PricingConfig;
  el: PricingConfig;
}

interface DynamicUsagePricingComponentProps {
  defaultConfig: DynamicUsagePricingParentConfig;
  locale: string;
  variant: 1 | 2;
  fromServerUrl?: string;
}

async function fetchPricingConfig(
  url: string,
  locale: string
): Promise<PricingConfig | null> {
  try {
    const response = await fetch(`${url}/${locale}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch pricing config from ${url}/${locale}: ${response.status}`
      );
      return null;
    }

    const data = await response.json();
    return data as PricingConfig;
  } catch (error) {
    console.error(`Error fetching pricing config from ${url}/${locale}:`, error);
    return null;
  }
}

const DynamicUsagePricingComponent = async ({
  defaultConfig,
  locale,
  variant,
  fromServerUrl,
}: DynamicUsagePricingComponentProps) => {
  // Fallback to 'en' if locale is not 'en' or 'el'
  const safeLocale = (locale === "en" || locale === "el") ? locale : "en";
  let childConfig = defaultConfig[safeLocale];

  // Try to fetch from server if URL is provided
  if (fromServerUrl) {
    const fetchedConfig = await fetchPricingConfig(fromServerUrl, locale);
    if (fetchedConfig) {
      childConfig = fetchedConfig;
    }
    // If fetch fails, fallback to default config (childConfig remains unchanged)
  }

  if (variant === 2) {
    return <DynamicUsagePricingComponentVariant2 config={childConfig} locale={safeLocale} />;
  }

  return <DynamicUsagePricingComponentVariant1 config={childConfig} locale={safeLocale} />;
};

export { DynamicUsagePricingComponent };
export type {
  DynamicUsagePricingComponentProps,
  DynamicUsagePricingParentConfig,
  PricingConfig,
  Resource,
  Resources,
};
