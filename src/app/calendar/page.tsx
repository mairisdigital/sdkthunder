import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import CalendarSection from '../components/CalendarSection';
import Footer from '../components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDKThunder - Kalendārs',
  description: 'SDKThunder pasākumu kalendārs',
};

export default function Calendar() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <CalendarSection />
      <Footer />
    </div>
  );
}