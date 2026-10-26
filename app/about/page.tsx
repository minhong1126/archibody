import FirstSection from '@/components/about/FirstSection';
import SecondSection from '@/components/about/SecondSection';
import ThirdSection from '@/components/about/ThirdSection';
import Footer from '@/components/common/Footer';
import UpButton from '@/components/common/UpButton';

const Page = () => {
  return (
    <>
      <div className="gap-between-sections flex flex-col">
        <div className="lg-section pt-20 lg:pt-0">
          <FirstSection />
        </div>
        <div className="lg-section">
          <SecondSection />
        </div>
        <div className="lg-section">
          <ThirdSection />
        </div>
      </div>
      <div className="lg:snap-start">
        <Footer />
      </div>
      <UpButton />
    </>
  );
};

export default Page;
