import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDKThunder - Par mums',
  description: 'Informācija par SDKThunder',
};

export default function About() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <AboutSection />
      <Footer />
    </div>
  );
}