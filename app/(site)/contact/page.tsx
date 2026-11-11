import Footer from '@/components/common/Footer';
import Contact from '@/components/contact/Contact';

const Page = () => {
  return (
    <>
      <Contact />
      <div className="block lg:hidden">
        <Footer />
      </div>
    </>
  );
};

export default Page;
