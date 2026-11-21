import {useState} from 'react';
import {BeforeAfterSection} from './components/BeforeAfterSection';
import {BookingSection} from './components/BookingSection';
import {Footer} from './components/Footer';
import {GallerySection} from './components/GallerySection';
import {HeroSection} from './components/HeroSection';
import {Navbar} from './components/Navbar';
import {ServicesSection} from './components/ServicesSection';
import {SpaceVideoSection} from './components/SpaceVideoSection';
import {SERVICES} from './data/barbershop';

export default function App() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0].id);
  const [prefilledNote, setPrefilledNote] = useState<string>('');

  const scrollToBooking = () => {
    const el = document.getElementById('agendamento');
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    scrollToBooking();
  };

  const handleBookStyle = (styleTitle: string) => {
    setPrefilledNote(styleTitle);
    scrollToBooking();
  };

  return (
    <div className="min-h-screen bg-[#101116] text-[#F1EAE0] selection:bg-[#CDA77F] selection:text-[#101116]">
      <Navbar />
      <main>
        <HeroSection onBookClick={scrollToBooking} />
        <BeforeAfterSection />
        <SpaceVideoSection />
        <ServicesSection onSelectService={handleSelectService} />
        <GallerySection onBookStyle={handleBookStyle} />
        <BookingSection
          selectedServiceId={selectedServiceId}
          prefilledNote={prefilledNote}
          onChangeServiceId={setSelectedServiceId}
        />
      </main>
      <Footer />
    </div>
  );
}
