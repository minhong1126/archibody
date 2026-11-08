import FirstSection from '@/components/about/FirstSection';
import SecondSection from '@/components/about/SecondSection';
import ThirdSection from '@/components/about/ThirdSection';
import Footer from '@/components/common/Footer';
import UpButton from '@/components/common/UpButton';

const Page = () => {
  return (
    <>
      <div className="gap-between-sections">
        <div className="lg:lg-section lg:pt-0">
          <FirstSection />
        </div>
        <div className="lg:lg-section">
          <SecondSection />
        </div>
        <div className="lg:lg-section">
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
