import Footer from '@/components/common/Footer';
import Contact from '@/components/contact/Contact';

const Page = () => {
  return (
    <div className="pt-20">
      <Contact />
      <div className="block lg:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default Page;
