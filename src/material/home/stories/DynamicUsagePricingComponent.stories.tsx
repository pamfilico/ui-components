import type { Meta, StoryObj } from "@storybook/react";
import { DynamicUsagePricingComponent } from "../DynamicUsagePricingComponent";
import type { DynamicUsagePricingParentConfig } from "../DynamicUsagePricingComponent";

const meta = {
  title: "Material/Home/DynamicUsagePricingComponent",
  component: DynamicUsagePricingComponent,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DynamicUsagePricingComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleConfig: DynamicUsagePricingParentConfig = {
  en: {
    minPrice: 10,
    resources: {
      vehicles: {
        name: "Vehicles",
        subtitle: "Number of vehicles in your fleet",
        price_per_item: 3,
        explanation:
          "Each vehicle in your fleet costs 3€ per month. This includes tracking, maintenance schedules, and driver assignments.",
      },
      drivers: {
        name: "Drivers",
        subtitle: "Active drivers in your system",
        price_per_item: 2,
        explanation:
          "Each driver account costs 2€ per month. Includes license verification, route tracking, and performance analytics.",
      },
      locations: {
        name: "Locations",
        subtitle: "Pickup/dropoff points",
        price_per_item: 1,
        explanation:
          "Each location (depot, pickup point, etc.) costs 1€ per month. Includes geofencing and availability management.",
      },
    },
    pricing_explanation:
      "# How Our Pricing Works\n\nYou only pay for what you use:\n\n- **Minimum charge**: 10€/month\n- **Per vehicle**: 3€/month\n- **Per driver**: 2€/month\n- **Per location**: 1€/month\n\nNo hidden fees. Cancel anytime.",
  },
  el: {
    minPrice: 10,
    resources: {
      vehicles: {
        name: "Οχήματα",
        subtitle: "Αριθμός οχημάτων στον στόλο σας",
        price_per_item: 3,
        explanation:
          "Κάθε όχημα στον στόλο σας κοστίζει 3€ ανά μήνα. Περιλαμβάνει παρακολούθηση, προγράμματα συντήρησης και ανάθεση οδηγών.",
      },
      drivers: {
        name: "Οδηγοί",
        subtitle: "Ενεργοί οδηγοί στο σύστημά σας",
        price_per_item: 2,
        explanation:
          "Κάθε λογαριασμός οδηγού κοστίζει 2€ ανά μήνα. Περιλαμβάνει επαλήθευση άδειας, παρακολούθηση διαδρομής και αναλυτικά στοιχεία απόδοσης.",
      },
      locations: {
        name: "Τοποθεσίες",
        subtitle: "Σημεία παραλαβής/παράδοσης",
        price_per_item: 1,
        explanation:
          "Κάθε τοποθεσία (αποθήκη, σημείο παραλαβής κ.λπ.) κοστίζει 1€ ανά μήνα. Περιλαμβάνει geofencing και διαχείριση διαθεσιμότητας.",
      },
    },
    pricing_explanation:
      "# Πώς Λειτουργεί η Τιμολόγησή μας\n\nΠληρώνετε μόνο για αυτό που χρησιμοποιείτε:\n\n- **Ελάχιστη χρέωση**: 10€/μήνα\n- **Ανά όχημα**: 3€/μήνα\n- **Ανά οδηγό**: 2€/μήνα\n- **Ανά τοποθεσία**: 1€/μήνα\n\nΧωρίς κρυφές χρεώσεις. Ακύρωση ανά πάσα στιγμή.",
  },
};

export const EnglishVariant1: Story = {
  args: {
    defaultConfig: sampleConfig,
    locale: "en",
    variant: 1,
  },
};

export const EnglishVariant2: Story = {
  args: {
    defaultConfig: sampleConfig,
    locale: "en",
    variant: 2,
  },
};

export const GreekVariant1: Story = {
  args: {
    defaultConfig: sampleConfig,
    locale: "el",
    variant: 1,
  },
};

export const GreekVariant2: Story = {
  args: {
    defaultConfig: sampleConfig,
    locale: "el",
    variant: 2,
  },
};
