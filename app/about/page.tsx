import React from 'react';
import Footer from '@/common/Footer';
import UpButton from '@/common/UpButton';
import FirstSection from '@/pageComponents/about/FirstSection';
import SecondSection from '@/pageComponents/about/SecondSection';
import ThirdSection from '@/pageComponents/about/ThirdSection';

const Page = () => {
  return (
    <>
      <div className="pt-20 lg:h-screen lg:snap-start lg:pt-0">
        <FirstSection />
      </div>
      <div className="lg:h-screen lg:snap-start">
        <SecondSection />
      </div>
      <div className="lg:h-screen lg:snap-start lg:pt-10">
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
