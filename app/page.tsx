import Footer from '@/components/common/Footer';
import UpButton from '@/components/common/UpButton';
import FirstSection from '@/components/page/FirstSection';
import SecondSection from '@/components/page/SecondSection';
import ThirdSection from '@/components/page/ThirdSection';

const Page = () => {
  return (
    <>
      <div className="gap-between-sections">
        <div className="lg-section pt-20">
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
