import Footer from '@/common/Footer';
import FirstSection from '../pageComponents/page/FirstSection';
import SecondSection from '../pageComponents/page/SecondSection';
import ThirdSection from '../pageComponents/page/ThirdSection';
import UpButton from '@/common/UpButton';

const Page = () => {
  return (
    <>
      <div className="lg:h-screen lg:snap-start">
        <FirstSection />
      </div>
      <div className="lg:h-screen lg:snap-start">
        <SecondSection />
      </div>
      <div className="lg:h-screen lg:snap-start">
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
