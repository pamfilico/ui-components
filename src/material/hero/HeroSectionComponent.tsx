import React from "react";
import HeroSectionVariant4, { HeroContent } from "./HeroSectionVariant4";

export interface HeroSectionParentConfig {
  en: HeroContent;
  el: HeroContent;
  [key: string]: HeroContent;
}

export interface HeroSectionComponentProps {
  defaultConfig: HeroSectionParentConfig;
  locale: string;
  onPrimaryCTAClick?: () => void;
  onSecondaryCTAClick?: () => void;
  showPrimaryBtn?: boolean;
  showSecondaryBtn?: boolean;
}

const HeroSectionComponent: React.FC<HeroSectionComponentProps> = ({
  defaultConfig,
  locale,
  onPrimaryCTAClick,
  onSecondaryCTAClick,
  showPrimaryBtn = true,
  showSecondaryBtn = true,
}) => {
  const safeLocale = (locale === "en" || locale === "el") ? locale : "en";
  const childContent = defaultConfig[safeLocale];

  return (
    <HeroSectionVariant4
      content={childContent}
      onPrimaryCTAClick={onPrimaryCTAClick}
      onSecondaryCTAClick={onSecondaryCTAClick}
      showPrimaryBtn={showPrimaryBtn}
      showSecondaryBtn={showSecondaryBtn}
    />
  );
};

export default HeroSectionComponent;
