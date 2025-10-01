import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import NewsPageSection from '../components/NewsPageSection';
import Footer from '../components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDKThunder - Jaunumi',
  description: 'SDKThunder jaunumi un ziņas',
};

export default function News() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <NewsPageSection />
      <Footer />
    </div>
  );
}