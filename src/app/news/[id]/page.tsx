import TopBar from '../../components/TopBar';
import Navbar from '../../components/Navbar';
import SingleNewsSection from '../../components/SingleNewsSection';
import Footer from '../../components/Footer';

export default function SingleNews({ params }: { params: { id: string } }) {
  return (
    <div>
      <TopBar />
      <Navbar />
      <SingleNewsSection newsId={params.id} />
      <Footer />
    </div>
  );
}