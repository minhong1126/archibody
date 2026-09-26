import Footer from '@/common/Footer';
import UpButton from '@/common/UpButton';
import FirstSection from '../pageComponents/page/FirstSection';
import SecondSection from '../pageComponents/page/SecondSection';
import ThirdSection from '../pageComponents/page/ThirdSection';

const Page = () => {
  return (
    <>
      <div className="gap-between-sections flex flex-col">
        <div className="pt-20 lg:h-screen lg:snap-start">
          <FirstSection />
        </div>
        <div className="lg:h-screen lg:snap-start">
          <SecondSection />
        </div>
        <div className="lg:h-screen lg:snap-start">
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
