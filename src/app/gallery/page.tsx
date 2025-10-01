import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import GallerySection from '../components/GallerySection';
import Footer from '../components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDKThunder - Galerija',
  description: 'SDKThunder galerija - Foto un video',
};

export default function Gallery() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <GallerySection />
      <Footer />
    </div>
  );
}