import MainFooter from '@/components/common/Footer';
import ProjectsListSection from '@/components/projects/ProjectsListSection';

const Page = () => {
  return (
    <div className="pt-20 lg:pt-24">
      <ProjectsListSection />
      <div className="lg:hidden">
        <MainFooter />
      </div>
    </div>
  );
};

export default Page;
