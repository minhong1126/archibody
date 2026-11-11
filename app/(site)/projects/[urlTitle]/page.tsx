import Footer from '@/components/common/Footer';
import ProjectDetail from '@/components/projects/ProjectsDetail';

const Page = () => {
  return (
    <>
      <ProjectDetail />
      <div className="lg:hidden">
        <Footer />
      </div>
    </>
  );
};

export default Page;
