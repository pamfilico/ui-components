import type { Meta, StoryObj } from "@storybook/react";
import QRCodeShare from "./QRCodeShare";

const meta = {
  title: "Material/Misc/QRCodeShare",
  component: QRCodeShare,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof QRCodeShare>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default QR code share component with a sample URL
 */
export const Default: Story = {
  args: {
    url: "https://example.com/user/john-doe",
    title: "Share Profile",
    size: 200,
  },
};

/**
 * QR code without title
 */
export const WithoutTitle: Story = {
  args: {
    url: "https://example.com/song/amazing-grace",
    size: 200,
  },
};

/**
 * Large QR code
 */
export const LargeSize: Story = {
  args: {
    url: "https://example.com/gig/live-performance",
    title: "Scan to View Live Gig",
    size: 300,
  },
};

/**
 * Small QR code
 */
export const SmallSize: Story = {
  args: {
    url: "https://example.com/artist/jane-smith",
    title: "Artist Profile",
    size: 150,
  },
};

/**
 * Song sharing example
 */
export const SongShare: Story = {
  args: {
    url: "https://musicapp.com/songs/12345",
    title: "Share This Song",
    size: 200,
  },
};

/**
 * Artist profile example
 */
export const ArtistProfile: Story = {
  args: {
    url: "https://musicapp.com/artists/john-musician",
    title: "Visit My Profile",
    size: 220,
  },
};

/**
 * Live performance example
 */
export const LivePerformance: Story = {
  args: {
    url: "https://musicapp.com/live/tonight-show",
    title: "Join Live Performance",
    size: 250,
  },
};
