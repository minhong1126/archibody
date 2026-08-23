import MainFooter from "@/common/MainFooter";
import FirstSection from "./page/FirstSection";
import SecondSection from "./page/SecondSection";
import ThirdSection from "./page/ThirdSection";
import UpButton from "@/common/UpButton";

const page = () => {
  return (
    <>
      <FirstSection />
      <SecondSection />
      <ThirdSection />
      <MainFooter />
      <UpButton />
    </>
  );
};

export default page;
