import Footer from '@/components/common/Footer';
import ProjectDetail from '@/components/projects/ProjectsDetail';

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
