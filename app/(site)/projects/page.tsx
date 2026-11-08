import MainFooter from '@/components/common/Footer';
import ProjectsListSection from '@/components/projects/ProjectsListSection';

const Page = () => {
  return (
    <>
      <ProjectsListSection />
      <div className="lg:hidden">
        <MainFooter />
      </div>
    </>
  );
};

export default Page;
