import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import LocationsSection from '../components/LocationsSection';
import Footer from '../components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDKThunder - Vietas',
  description: 'SDKThunder atrašanās vietas un kontakti',
};

export default function Locations() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <LocationsSection />
      <Footer />
    </div>
  );
}