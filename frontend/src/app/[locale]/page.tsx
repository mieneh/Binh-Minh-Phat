import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/bmp/HeroSection';
import AboutSection from '@/components/bmp/AboutSection';
import ServicesSection from '@/components/bmp/ServicesSection';
import ProductsSection from '@/components/bmp/ProductsSection';
import CapabilitiesSection from '@/components/bmp/CapabilitiesSection';
import PartnersSection from '@/components/bmp/PartnersSection';
import CertificationsSection from '@/components/bmp/CertificationsSection';
import CareersSection from '@/components/bmp/CareersSection';
import ContactSection from '@/components/bmp/ContactSection';
import StickyQuoteButton from '@/components/ui/sticky-quote-button';

export default async function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProductsSection />
        <CapabilitiesSection />
        <PartnersSection /> 
        <CertificationsSection />
        <CareersSection />
        <ContactSection />
        <StickyQuoteButton />
      </main>
      <Footer />
    </div>
  );
}
