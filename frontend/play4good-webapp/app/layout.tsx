import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Navbar from "./components/Navbar";
import './styles/global.css'; // This imports the new global styles
import Footer from "./components/footer";

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
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>
      <body className={nunito.className}>
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}