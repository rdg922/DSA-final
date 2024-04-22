import "~/styles/globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "DSA Final",
  description: "Rohit Dasgupta, Jeevan Iyadurai, Adam Gulde",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`font-sans ${inter.variable}`}>
      <div className="jersey-10-regular text-white w-full flex tracking-wide justify-center bg-[#2e026d]">
      Cellular Automata vs. Wave Function Collapse
      </div>
      {children}
      </body>
    </html>
  );
}
