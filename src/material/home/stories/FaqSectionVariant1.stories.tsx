import type { Meta, StoryObj } from "@storybook/react";
import { FaqSectionVariant1 } from "../FaqSectionVariant1";

const meta = {
  title: "Material/Home/FaqSectionVariant1",
  component: FaqSectionVariant1,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FaqSectionVariant1>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleFaqs = [
  {
    id: "1",
    title: "How do I get started?",
    description: "Just click login and begin your epic journey.",
    demo_section_id: "demo_section",
  },
  {
    id: "2",
    title: "What features are included?",
    description: "Our platform includes multi-language support, SEO optimization, and a powerful content management system.",
    demo_section_id: null,
  },
  {
    id: "3",
    title: "How much does it cost?",
    description: "We offer flexible pricing plans to suit businesses of all sizes. Check out our pricing page for more details.",
    demo_section_id: "pricing_section",
  },
  {
    id: "4",
    title: "Is there a free trial?",
    description: "Yes! We offer a 14-day free trial with full access to all features.",
    demo_section_id: null,
  },
  {
    id: "5",
    title: "How do I cancel my subscription?",
    description: "You can cancel your subscription at any time from your account settings. No questions asked.",
    demo_section_id: null,
  },
];

export const Default: Story = {
  args: {
    title: "Frequently Asked Questions",
    items: sampleFaqs,
    section_id: "faq_section",
  },
};

export const CustomTitle: Story = {
  args: {
    title: "Got Questions? We've Got Answers!",
    items: sampleFaqs,
    section_id: "questions",
  },
};

export const FewFaqs: Story = {
  args: {
    title: "Common Questions",
    items: sampleFaqs.slice(0, 3),
    section_id: "common_questions",
  },
};

export const NoDemoButtons: Story = {
  args: {
    title: "Frequently Asked Questions",
    items: sampleFaqs.map(faq => ({ ...faq, demo_section_id: null })),
    section_id: "faq_no_demo",
  },
};
