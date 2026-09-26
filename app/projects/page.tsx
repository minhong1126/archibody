import MainFooter from '@/common/Footer';
import ProjectsListSection from '@/pageComponents/programs/ProjectsListSection';

const Page = () => {
  return (
    <div className="pt-20 lg:size-full lg:pt-24">
      <ProjectsListSection />
      <div className="lg:hidden">
        <MainFooter />
      </div>
    </div>
  );
};

export default Page;
