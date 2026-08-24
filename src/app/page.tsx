import { About } from '@/components/about/about';
import { Analytics } from '@/components/analytics/analytics';
import { Contact } from '@/components/contact/contact';
import { Duality } from '@/components/developer-data/duality';
import { Education } from '@/components/education/education';
import { Experience } from '@/components/experience/experience';
import { Footer } from '@/components/footer/footer';
import { Hero } from '@/components/hero/hero';
import { ProfessionalLinks } from '@/components/links/professional-links';
import { Navbar } from '@/components/navbar/navbar';
import { Projects } from '@/components/projects/projects';
import { Skills } from '@/components/skills/skills';
import { BackToTop } from '@/components/ui/back-to-top';
import { Cursor } from '@/components/ui/cursor';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Cursor />

      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Duality />
        <Projects />
        <Analytics />
        <Experience />
        <Education />
        <ProfessionalLinks />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
