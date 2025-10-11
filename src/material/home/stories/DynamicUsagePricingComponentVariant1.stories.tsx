import type { Meta, StoryObj } from "@storybook/react";
import { DynamicUsagePricingComponentVariant1 } from "../DynamicUsagePricingComponentVariant1";

const meta = {
  title: "Material/Home/DynamicUsagePricingComponentVariant1",
  component: DynamicUsagePricingComponentVariant1,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DynamicUsagePricingComponentVariant1>;

export default meta;
type Story = StoryObj<typeof meta>;

const minPrice = 10;

const resourcesEn = {
  car: {
    name: "Cars with Reservations",
    price_per_item: 3,
    explanation:
      "This is the per-vehicle cost. You pay 3€ for each vehicle that is actually used in a month. Used means at least one reservation.",
  },
  motorcycle: {
    name: "Motorcycle/Quads with Reservations",
    price_per_item: 2,
    explanation:
      "This is the per-vehicle cost. You pay 2€ for each vehicle that is actually used in a month. Used means at least one reservation.",
  },
  bicycle: {
    name: "Bicycles with Reservations",
    price_per_item: 1,
    explanation:
      "This is the per-vehicle cost. You pay 1€ for each vehicle that is actually used in a month. Used means at least one reservation.",
  },
  emails: {
    name: "Personal Booking form sync",
    price_per_item: 0.1,
    explanation:
      "This cost applies per email sync operation. You only pay for the actual syncs performed. We sync emails from your booking forms and display them as requests in the app.",
  },
};

const pricingExplanationEn = `#### Pricing is Usage Based with Minimum Subscription

No matter how many vehicles are registered, you only pay for the vehicles that are actually used in a month.

#### How It Works

- **Usage-Based Billing:**
  You are charged solely for the vehicles in use.

- **Example:**
  If you have 1000 vehicles in the system but only 1 is working in a month, the charge will be:

  1 x 3 € = 3 €

- **Minimum Charge:**
  If your usage cost is lower than the calculated amount, a minimum fee of **${minPrice} €** applies.

- **Other Charges:**
  see terms for custom solutions, commissions etc.
`;

export const Default: Story = {
  args: {
    config: {
      minPrice,
      resources: resourcesEn,
      pricing_explanation: pricingExplanationEn,
    },
    locale: "en",
  },
};

export const Greek: Story = {
  args: {
    config: {
      minPrice,
      resources: resourcesEn,
      pricing_explanation: pricingExplanationEn,
    },
    locale: "el",
  },
};

export const MinimalResources: Story = {
  args: {
    config: {
      minPrice,
      resources: {
        car: {
          name: "Cars with Reservations",
          price_per_item: 3,
          explanation:
            "This is the per-vehicle cost. You pay 3€ for each vehicle that is actually used in a month.",
        },
      },
      pricing_explanation: `### Simple Pricing

Pay only for what you use with a minimum monthly fee of **${minPrice} €**.`,
    },
    locale: "en",
  },
};

export const WithSubtitles: Story = {
  args: {
    config: {
      minPrice: 15,
      resources: {
        premium: {
          name: "Premium Vehicles",
          subtitle: "Luxury cars and SUVs",
          price_per_item: 5,
          explanation:
            "Premium tier vehicles including luxury sedans and high-end SUVs. Higher rental value means higher service fee.",
        },
        standard: {
          name: "Standard Vehicles",
          subtitle: "Economy and mid-size cars",
          price_per_item: 3,
          explanation:
            "Standard economy and mid-size vehicles for everyday rentals.",
        },
        compact: {
          name: "Compact Vehicles",
          subtitle: "Budget-friendly options",
          price_per_item: 2,
          explanation: "Compact and budget-friendly vehicles for cost-conscious customers.",
        },
      },
      pricing_explanation: `### Tiered Pricing Model

Our pricing adapts to your fleet composition. Premium vehicles have a higher service fee reflecting their higher value and maintenance requirements.

**Minimum monthly subscription: €${15}**`,
    },
    locale: "en",
  },
};
