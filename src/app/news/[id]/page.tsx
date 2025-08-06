import TopBar from '../../components/TopBar';
import Navbar from '../../components/Navbar';
import SingleNewsSection from '../../components/SingleNewsSection';
import Footer from '../../components/Footer';

export default async function SingleNews({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div>
      <TopBar />
      <Navbar />
      <SingleNewsSection newsId={id} />
      <Footer />
    </div>
  );
}
