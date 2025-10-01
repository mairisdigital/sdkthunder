import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EventsSection from './components/EventsSection';
import PartnersSection from './components/PartnersSection';
import NewsSection from './components/NewsSection';
import Footer from './components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDKThunder - Sākums',
  description: 'SDKThunder - Sporta Draugu Klubs',
};

export default function Home() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <HeroSection />
      <EventsSection />
      <PartnersSection />
      <NewsSection />
      <Footer />
    </div>
  );
}