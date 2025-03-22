import { getDefaultLocale } from '@/i18n';
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultLocale = getDefaultLocale();

  return (
    <html lang={defaultLocale}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}