import React from 'react'
import { Providers } from './providers';
import "../src/global.module.css";
import type { Metadata } from 'next';
import { keywords } from '@/constants/keywords';

export const metadata: Metadata = {
  title: 'AMAFA.XYZ',
  applicationName: "AMAFA.XYZ",
  authors: [
    {
      name: "sibongiseni",
      url: "https://sibongiseni.eth"
    },
    {
      name: "Mindsgn Studio",
      url: "https://mindsgn.studio"
    }
  ],
  description:
    'Amafa is a modern, open source asset management software that lets you create, manage, assign and overview your assets and equipment. From small office equipment to construction cranes.',
  keywords,
  twitter: {
    site: "https://amafa.xyz",
    title: "Amafa.xyz"
  },

};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
