import type { Meta, StoryObj } from "@storybook/react";
import { FeatureSectionVariant1 } from "../FeatureSectionVariant1";

const meta = {
  title: "Material/Home/FeatureSectionVariant1",
  component: FeatureSectionVariant1,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FeatureSectionVariant1>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleFeatures = [
  {
    id: "1",
    title: "Fast Performance",
    description: "Lightning-fast load times and optimized performance for the best user experience.",
  },
  {
    id: "2",
    title: "Responsive Design",
    description: "Beautiful layouts that work perfectly on desktop, tablet, and mobile devices.",
  },
  {
    id: "3",
    title: "Easy to Use",
    description: "Intuitive interface that makes managing your content a breeze.",
  },
  {
    id: "4",
    title: "Secure",
    description: "Enterprise-grade security to keep your data safe and protected.",
  },
  {
    id: "5",
    title: "Customizable",
    description: "Fully customizable to match your brand and workflow requirements.",
  },
  {
    id: "6",
    title: "24/7 Support",
    description: "Round-the-clock customer support to help you whenever you need it.",
  },
];

export const Default: Story = {
  args: {
    title: "Features",
    features: sampleFeatures,
    section_id: "features",
  },
};

export const CustomTitle: Story = {
  args: {
    title: "Why Choose Us",
    features: sampleFeatures,
    section_id: "why-choose-us",
  },
};

export const FewFeatures: Story = {
  args: {
    title: "Core Features",
    features: sampleFeatures.slice(0, 3),
    section_id: "core-features",
  },
};

export const ManyFeatures: Story = {
  args: {
    title: "All Features",
    features: [
      ...sampleFeatures,
      {
        id: "7",
        title: "API Access",
        description: "Powerful API for integrations and automation.",
      },
      {
        id: "8",
        title: "Analytics",
        description: "Detailed analytics and insights to track your progress.",
      },
      {
        id: "9",
        title: "Collaboration",
        description: "Team collaboration features for seamless workflow.",
      },
    ],
    section_id: "all-features",
  },
};
