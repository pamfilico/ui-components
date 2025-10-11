import type { Meta, StoryObj } from "@storybook/react";
import HeroSectionVariant4 from "../HeroSectionVariant4";

const meta = {
  title: "Material/Hero/HeroSectionVariant4",
  component: HeroSectionVariant4,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HeroSectionVariant4>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultContent = {
  headline: "Streamline Your Car Rental Business",
  subheadline:
    "A modern platform to manage your fleet, bookings, and customers all in one place",
  valueProposition:
    "Save time and grow your rental business with smart automation",
  primaryCTA: "Get Started",
  secondaryCTA: "View Features",
  features: [
    "Easy to use",
    "Cloud-based platform",
    "Real-time updates",
    "Detailed analytics",
  ],
  trustBadges: [
    "Secure Platform",
    "Fast Setup",
    "Email Support",
    "Modern Dashboard",
  ],
  whyChooseTitle: "Why Choose CarFast?",
  whyChooseFeatures: [
    {
      title: "Lightning Fast",
      description: "Setup in 5 minutes, see results immediately",
    },
    {
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance",
    },
    {
      title: "Dedicated Support",
      description: "24/7 expert support and onboarding assistance",
    },
    {
      title: "Proven Results",
      description: "Average 40% revenue increase in 3 months",
    },
  ],
};

export const Default: Story = {
  args: {
    content: defaultContent,
    onPrimaryCTAClick: () => alert("Primary CTA clicked!"),
    onSecondaryCTAClick: () => alert("Secondary CTA clicked!"),
  },
};

export const Minimal: Story = {
  args: {
    content: {
      headline: "Simple Car Rental",
      subheadline: "Everything you need to manage rentals",
      valueProposition: "Get started in minutes",
      primaryCTA: "Start Now",
      secondaryCTA: "Learn More",
      features: ["Easy", "Fast"],
      trustBadges: ["Secure", "Reliable"],
      whyChooseTitle: "Why Choose Us?",
      whyChooseFeatures: [
        {
          title: "Simple",
          description: "Easy to use interface",
        },
        {
          title: "Secure",
          description: "Your data is protected",
        },
      ],
    },
    onPrimaryCTAClick: () => alert("Primary CTA clicked!"),
    onSecondaryCTAClick: () => alert("Secondary CTA clicked!"),
  },
};

export const Enterprise: Story = {
  args: {
    content: {
      headline: "Complete Fleet Management Solution",
      subheadline:
        "Enterprise-grade platform with advanced features for growing businesses",
      valueProposition:
        "Scale your rental business with powerful automation and insights",
      primaryCTA: "Start Free Trial",
      secondaryCTA: "Schedule Demo",
      features: [
        "Advanced Analytics",
        "Multi-location Support",
        "Custom Integrations",
        "24/7 Support",
        "API Access",
        "Mobile Apps",
      ],
      trustBadges: [
        "SOC 2 Certified",
        "99.9% Uptime",
        "Enterprise Support",
        "White Label Options",
        "Data Export",
      ],
      whyChooseTitle: "Enterprise Features",
      whyChooseFeatures: [
        {
          title: "Advanced Analytics",
          description: "Deep insights into your business performance",
        },
        {
          title: "Multi-location",
          description: "Manage multiple rental locations effortlessly",
        },
        {
          title: "Custom Integrations",
          description: "Connect with your existing tools and systems",
        },
        {
          title: "Scalable Infrastructure",
          description: "Grows with your business needs",
        },
        {
          title: "White Label Options",
          description: "Brand the platform as your own",
        },
      ],
    },
    onPrimaryCTAClick: () => alert("Primary CTA clicked!"),
    onSecondaryCTAClick: () => alert("Secondary CTA clicked!"),
  },
};

export const PrimaryButtonOnly: Story = {
  args: {
    content: defaultContent,
    onPrimaryCTAClick: () => alert("Primary CTA clicked!"),
    showPrimaryBtn: true,
    showSecondaryBtn: false,
  },
};

export const SecondaryButtonOnly: Story = {
  args: {
    content: defaultContent,
    onSecondaryCTAClick: () => alert("Secondary CTA clicked!"),
    showPrimaryBtn: false,
    showSecondaryBtn: true,
  },
};

export const NoButtons: Story = {
  args: {
    content: defaultContent,
    showPrimaryBtn: false,
    showSecondaryBtn: false,
  },
};
