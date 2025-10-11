// Translation utility for component-scoped translations

interface TranslationLoader {
  [locale: string]: {
    [componentName: string]: {
      [key: string]: string;
    };
  };
}

export class ComponentTranslator {
  private messages: { [key: string]: string };

  constructor(
    componentName: string,
    locale: string,
    translations: TranslationLoader
  ) {
    this.messages =
      translations[locale]?.[componentName] || translations.en?.[componentName] || {};
  }

  translate(key: string): string {
    return this.messages[key] || key;
  }

  t(key: string): string {
    return this.translate(key);
  }
}

export const createTranslator = (
  componentName: string,
  locale: string,
  translations: TranslationLoader
): ComponentTranslator => {
  return new ComponentTranslator(componentName, locale, translations);
};
