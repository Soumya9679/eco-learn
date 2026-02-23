import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcoLearn — Interactive Environmental Education",
  description:
    "Learn about sustainability through interactive modules, quizzes, challenges, and games. Earn EcoPoints and make a real-world impact.",
  keywords: [
    "environmental education",
    "sustainability",
    "eco learning",
    "green education",
    "climate change",
    "gamified learning",
  ],
  authors: [{ name: "EcoLearn Team" }],
  openGraph: {
    title: "EcoLearn — Interactive Environmental Education",
    description:
      "Learn about sustainability through interactive modules, quizzes, challenges, and games.",
    type: "website",
    siteName: "EcoLearn",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        <meta name="theme-color" content="#10b981" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className="font-sans antialiased"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
