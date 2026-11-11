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

const ARTICLE_CLASS =
  'mx-auto grid w-full grid-cols-1 px-[10%] lg:px-[20%] pb-[clamp(56px,8vw,80px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:grid-rows-[auto_auto_1fr] lg:items-start lg:gap-x-[clamp(20px,2vw,40px)]';

const GALLERY_AREA_CLASS =
  'mt-[clamp(24px,8vw,32px)] min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:mt-0 lg:h-[max(360px,calc(100dvh_-_var(--header-h,96px)_-_27px_-_clamp(24px,2.8vw,54px)_-_clamp(56px,8vw,80px)))] lg:w-full';

const ProjectDetail = () => {
  const params = useParams<{ urlTitle: string }>();
  const urlTitle = params?.urlTitle ? decodeURIComponent(params.urlTitle) : '';

  const [project, setProject] = useState<SanityProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 주소에서 값을 못 읽어도 로딩이 끝나도록
    if (!urlTitle) {
      setLoading(false);
      return;
    }

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
    { label: '대지면적', value: formatArea(project.siteArea) },
    { label: '건축면적', value: formatArea(project.buildingArea) },
    { label: '연면적', value: formatArea(project.totalFloorArea) },
  ];

  // 대표 이미지 + 갤러리를 한 목록으로
  const images = [project.thumbnail, ...(project.gallery ?? [])].filter(
    Boolean,
  );

  return (
    <article className={ARTICLE_CLASS}>
      <h1 className="section-title lg:col-start-1 lg:row-start-2 lg:text-left">
        {project.title}
      </h1>

      <nav
        aria-label="현재 위치"
        className="mt-[clamp(24px,8vw,40px)] lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:mb-[clamp(24px,2.8vw,54px)]"
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
      <dl className="mt-[clamp(28px,9vw,44px)] flex min-w-0 flex-col gap-[1.1em] text-[clamp(9px,6.75px_+_0.586vw,18px)] lg:col-start-1 lg:row-start-3 lg:mt-[clamp(32px,3.35vw,64px)]">
        {specItems.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-[1em]">
            <dt className="w-[4.5em] shrink-0 text-neutral-400">{label}</dt>
            <span aria-hidden className="h-[0.8em] w-px shrink-0 bg-gray-200" />
            <dd className="min-w-0 text-neutral-500">{value}</dd>
          </div>
        ))}
      </dl>

      {images.length > 0 && (
        // 데스크탑: 오른쪽 절반 전체, 높이는 갤러리 시안 비율(1075:854)로 고정 → 왼쪽과 겹치지 않음
        <div className={GALLERY_AREA_CLASS}>
          <ProjectGallery images={images} title={project.title} />
        </div>
      )}
    </article>
  );
};

/** 로딩 중 스켈레톤 (실제 레이아웃과 같은 배치·간격) */
const ProjectDetailSkeleton = () => (
  <article aria-busy className={`${ARTICLE_CLASS} animate-pulse`}>
    <div className="mx-auto h-[clamp(20px,2.5vw,40px)] w-1/2 bg-neutral-200 lg:col-start-1 lg:row-start-2 lg:mx-0 lg:w-3/4" />
    <div className="mx-auto mt-[clamp(24px,8vw,40px)] h-[clamp(12px,1vw,20px)] w-2/5 bg-neutral-200 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:mt-0 lg:mb-[clamp(24px,2.8vw,54px)] lg:h-[clamp(18px,1.4vw,27px)] lg:w-1/5" />
    <div className="mt-[clamp(28px,9vw,44px)] flex flex-col gap-[clamp(10px,1vw,20px)] lg:col-start-1 lg:row-start-3 lg:mt-[clamp(32px,3.35vw,64px)]">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="h-[clamp(10px,0.95vw,18px)] w-3/5 bg-neutral-200"
        />
      ))}
    </div>
    <div
      className={`${GALLERY_AREA_CLASS} lg:flex lg:flex-col lg:gap-[clamp(8px,0.75vw,14px)]`}
    >
      <div className="aspect-[390/233] w-full bg-neutral-200 lg:aspect-auto lg:min-h-0 lg:flex-1" />
      <div className="hidden shrink-0 gap-[clamp(8px,0.65vw,12px)] lg:flex">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="aspect-[259/196] h-[clamp(56px,13vh,140px)] bg-neutral-200"
          />
        ))}
      </div>
    </div>
  </article>
);

export default ProjectDetail;
