import { Montserrat } from "next/font/google";
import "@/app/styles/globals.css"

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  title: "La Ventolera Candombe",
  description: "Sitio oficial de La Ventolera Candombe",
  icons: {
    icon: "/media/favicon.webp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
