import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MobileTabBar } from "@/components/site/MobileTabBar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main" className="min-h-dvh">
        {children}
      </main>
      <Footer />
      {/* Espacio para que la barra inferior móvil no tape el contenido */}
      <div aria-hidden className="h-24 lg:hidden" />
      <MobileTabBar />
    </>
  );
}
