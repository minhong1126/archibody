import Footer from '@/common/Footer';
import UpButton from '@/common/UpButton';
import FirstSection from '@/pageComponents/about/FirstSection';
import SecondSection from '@/pageComponents/about/SecondSection';
import ThirdSection from '@/pageComponents/about/ThirdSection';

const Page = () => {
  return (
    <>
      <div className="mb-45 pt-20 lg:mb-0 lg:h-screen lg:snap-start lg:pt-0">
        <FirstSection />
      </div>
      <div className="mb-45 lg:mb-0 lg:h-screen lg:snap-start">
        <SecondSection />
      </div>
      <div className="mb-45 lg:mb-0 lg:h-screen lg:snap-start">
        <ThirdSection />
      </div>
      <div className="lg:snap-start">
        <Footer />
      </div>
      <UpButton />
    </>
  );
};

export default Page;
