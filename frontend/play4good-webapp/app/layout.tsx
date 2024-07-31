import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import StyledComponentsRegistry from './registry'
import { GlobalStyle } from './globalStyles'


const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Play4Good",
  description: "Play4Good is an innovative platform that gamifies charitable giving and social impact. It allows users to support various causes through donations while engaging in friendly competition and team-based activities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={nunito.className}>
      <StyledComponentsRegistry >
        <GlobalStyle />
        {children}
      </StyledComponentsRegistry>
    </body>
  </html>
  );
}
