import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EventsSection from './components/EventsSection';
import PartnersSection from './components/PartnersSection';
import NewsSection from './components/NewsSection';
import ContactsSection from './components/ContactsSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <HeroSection />
      <EventsSection />
      <PartnersSection />
      <NewsSection />
      <ContactsSection />
      <Footer />
    </div>
  );
}