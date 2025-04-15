"use client";

import { useParams } from "next/navigation";
import { MessageCircle } from 'lucide-react';
import { t } from "@/i18n";

export default function StickyQuoteButton() {
  const { locale } = useParams() as { locale: "vi" | "en" };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <button
      onClick={scrollToContact}
      className="md:hidden fixed bottom-6 right-6 bg-amber-400 text-amber-900 px-6 py-4 rounded-full shadow-lg hover:bg-amber-500 transition-all z-40 flex items-center gap-2 animate-pulse"
      aria-label={t(locale, "ctaQuote")}
    >
      <MessageCircle size={20} />
      <span>{t(locale, "ctaQuote")}</span>
    </button>
  );
}
