'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProjectGallery from '@/components/projects/ProjectGallery';
import {
  getProjectDetailData,
  type SanityProjectDetail,
} from '@/feature/projects/getProjectDetailData';

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
};

/** 숫자만 입력된 면적에는 ㎡를 붙임 */
const formatArea = (value?: string | number) => {
  if (value === undefined || value === null || value === '') return '-';
  const text =
    typeof value === 'number' ? value.toLocaleString('ko-KR') : String(value);
  return text.includes('㎡') || text.includes('m') ? text : `${text}㎡`;
};

const ProjectDetail = () => {
  const params = useParams<{ urlTitle: string }>();
  const urlTitle = params?.urlTitle ? decodeURIComponent(params.urlTitle) : '';

  const [project, setProject] = useState<SanityProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!urlTitle) return;

    const fetchProject = async () => {
      try {
        setProject(await getProjectDetailData(urlTitle));
      } catch (error) {
        console.error('프로젝트 상세 데이터를 불러오지 못했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [urlTitle]);

  if (loading) return <ProjectDetailSkeleton />;

  if (!project) {
    return (
      <div className="w-full py-[clamp(80px,10vw,144px)] text-center text-[clamp(13px,11px_+_0.52vw,18px)] text-neutral-400">
        해당 프로젝트를 찾을 수 없습니다.
      </div>
    );
  }

  const specItems = [
    { label: '준공일', value: formatDate(project.completionDate) || '-' },
    { label: '위치', value: project.location || '-' },
    { label: '규모', value: project.scale || '-' },
    { label: '거주인원', value: project.occupants || '-' },
    { label: '대지면적', value: formatArea(project.landArea) },
    { label: '건축면적', value: formatArea(project.buildingArea) },
    { label: '연면적', value: formatArea(project.totalFloorArea) },
  ];

  // 대표 이미지 + 갤러리를 한 목록으로
  const images = [project.mainImage, ...(project.gallery ?? [])].filter(
    Boolean,
  );

  return (
    // 모바일: [제목·경로·정보·사진] / 데스크탑: 화면 높이에 맞춰 왼쪽 [경로·제목·정보] + 오른쪽 [사진]
    // 글자·간격은 화면 폭에 따라 clamp로 부드럽게 변함 (기준: 384px → 1920px)
    <article className="mx-auto grid w-full max-w-96 grid-cols-1 px-[10%] pb-[clamp(56px,8vw,80px)] lg:min-h-0 lg:max-w-432 lg:flex-1 lg:grid-cols-[minmax(180px,280px)_minmax(0,var(--gal-w))] lg:grid-rows-[auto_auto_minmax(0,1fr)] lg:justify-center lg:gap-x-0 lg:px-[clamp(48px,6vw,120px)] lg:pt-(--pt) lg:pb-(--pb) lg:[--crumb-fs:clamp(12px,10.5px_+_0.39vw,18px)] lg:[--crumb-mb:clamp(24px,2.8vw,54px)] lg:[--gal-w:min(960px,calc((100dvh_-_var(--header-h)_-_var(--pt)_-_var(--pb)_-_var(--crumb-fs)_*_1.5_-_var(--crumb-mb))_*_1075_/_854))] lg:[--pb:clamp(32px,6vh,80px)] lg:[--pt:clamp(8px,2vh,32px)]">
      {/* 제목: 16px → 40px (section-title) */}
      <h1 className="section-title lg:col-start-1 lg:row-start-2 lg:text-left lg:font-medium">
        {project.title}
      </h1>

      {/* 경로: 12px → 18px */}
      <nav
        aria-label="현재 위치"
        className="mt-[clamp(24px,8vw,40px)] lg:col-start-1 lg:row-start-1 lg:mt-0 lg:mb-(--crumb-mb)"
      >
        <ol className="flex flex-wrap justify-center gap-x-[1.3em] text-[clamp(12px,10.5px_+_0.39vw,18px)] leading-normal text-zinc-400 lg:justify-start">
          <li>
            <Link href="/projects" className="hover:text-zinc-600">
              프로젝트
            </Link>
          </li>
          {project.region && <li>{project.region}</li>}
          <li aria-current="page">{project.title}</li>
        </ol>
      </nav>

      {/* 정보: 9px → 18px, 줄 간격·칸 너비도 글자 크기(em)에 맞춰 변함 */}
      <dl className="mt-[clamp(28px,9vw,44px)] flex flex-col gap-[1.1em] text-[clamp(9px,6.75px_+_0.586vw,18px)] lg:col-start-1 lg:row-start-3 lg:mt-[clamp(32px,3.35vw,64px)] lg:min-h-0 lg:overflow-y-auto">
        {specItems.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-[1em]">
            <dt className="w-[4.5em] shrink-0 text-neutral-400">{label}</dt>
            <span aria-hidden className="h-[0.8em] w-px shrink-0 bg-gray-200" />
            <dd className="min-w-0 text-neutral-500">{value}</dd>
          </div>
        ))}
      </dl>

      {images.length > 0 && (
        <div className="mt-[clamp(24px,8vw,32px)] lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:mt-0 lg:min-h-0">
          <ProjectGallery images={images} title={project.title} />
        </div>
      )}
    </article>
  );
};

/** 로딩 중 스켈레톤 (실제 레이아웃과 같은 배치·간격) */
const ProjectDetailSkeleton = () => (
  <article
    aria-busy
    className="mx-auto grid w-full max-w-96 animate-pulse grid-cols-1 px-[10%] pb-[clamp(56px,8vw,80px)] lg:min-h-0 lg:max-w-432 lg:flex-1 lg:grid-cols-[minmax(180px,280px)_minmax(0,var(--gal-w))] lg:grid-rows-[auto_auto_minmax(0,1fr)] lg:justify-center lg:gap-x-0 lg:px-[clamp(48px,6vw,120px)] lg:pt-(--pt) lg:pb-(--pb) lg:[--crumb-fs:clamp(12px,10.5px_+_0.39vw,18px)] lg:[--crumb-mb:clamp(24px,2.8vw,54px)] lg:[--gal-w:min(960px,calc((100dvh_-_var(--header-h)_-_var(--pt)_-_var(--pb)_-_var(--crumb-fs)_*_1.5_-_var(--crumb-mb))_*_1075_/_854))] lg:[--pb:clamp(32px,6vh,80px)] lg:[--pt:clamp(8px,2vh,32px)]"
  >
    <div className="mx-auto h-[clamp(20px,2.5vw,40px)] w-1/2 bg-neutral-200 lg:col-start-1 lg:row-start-2 lg:mx-0 lg:w-3/4" />
    <div className="mx-auto mt-[clamp(24px,8vw,40px)] h-[clamp(12px,1vw,20px)] w-2/5 bg-neutral-200 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:mt-0 lg:mb-(--crumb-mb) lg:h-[calc(var(--crumb-fs)*1.5)] lg:w-1/2" />
    <div className="mt-[clamp(28px,9vw,44px)] flex flex-col gap-[clamp(10px,1vw,20px)] lg:col-start-1 lg:row-start-3 lg:mt-[clamp(32px,3.35vw,64px)]">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="h-[clamp(10px,0.95vw,18px)] w-3/5 bg-neutral-200"
        />
      ))}
    </div>
    <div className="mt-[clamp(24px,8vw,32px)] lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:mt-0 lg:flex lg:min-h-0 lg:flex-col lg:gap-[clamp(8px,0.75vw,14px)]">
      <div className="aspect-[390/233] w-full bg-neutral-200 lg:aspect-auto lg:min-h-0 lg:flex-1" />
      <div className="hidden gap-[clamp(8px,0.65vw,12px)] lg:flex">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="aspect-[259/196] h-[clamp(56px,9vh,110px)] bg-neutral-200"
          />
        ))}
      </div>
    </div>
  </article>
);

export default ProjectDetail;
