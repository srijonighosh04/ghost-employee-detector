import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusIQ | Organizational Knowledge Continuity",
  description:
    "NexusIQ maps what your organization knows, who holds it, and what breaks if they leave — before it becomes a crisis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <div className="app-backdrop" aria-hidden="true" />
        <div className="grain-layer" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
