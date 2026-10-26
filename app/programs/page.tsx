import Footer from '@/components/common/Footer';
import ProgramMainList from '@/components/programs/ProgramMainList';

const Page = () => {
  return (
    <>
      <ProgramMainList />
      <div className="block lg:hidden">
        <Footer />
      </div>
    </>
  );
};

export default Page;
