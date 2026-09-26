import Footer from '@/common/Footer';
import ProjectDetail from '@/pageComponents/programs/ProjectsDetail';

const ProjectDetailPage = () => {
  return (
    <div className="pt-20 lg:size-full lg:pt-24">
      <ProjectDetail />
      <div className="lg:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
