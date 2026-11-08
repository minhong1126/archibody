import Footer from '@/components/common/Footer';
import ProjectDetail from '@/components/projects/ProjectsDetail';

const Page = () => {
  return (
    <div className="pt-(--header-h) lg:flex lg:h-full lg:flex-col">
      <ProjectDetail />
      <div className="lg:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default Page;
