/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

type SanityProject = {
  _id: string;
  title: string;
  urlTitle: string;
  region: string;
  location: string;
  completionDate: string;
  thumbnail: any;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const regions = ['전체', '경기', '강원', '충남/충북', '전남/전북', '기타'];
const PAGE_SIZE = 8;

const ProjectContent = () => {
  const [projects, setProjects] = useState<SanityProject[]>([]);
  const [activeRegion, setActiveRegion] = useState('전체');
  const [activePage, setActivePage] = useState(1);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const query = `*[_type == "project"] | order(completionDate desc) {
          _id,
          title,
          "urlTitle": urlTitle.current,
          region,
          location,
          completionDate,
          thumbnail
        }`;

        const data = await client.fetch<SanityProject[]>(query);
        setProjects(data || []);
      } catch (error) {
        console.error('Sanity 데이터를 가져오는데 실패했습니다:', error);
      } finally {
        setIsFetched(true);
      }
    };

    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    if (activeRegion === '전체') return projects;

    return projects.filter((p) => {
      if (!p.region) return false;

      const cleanProjectRegion = p.region.replace(/\s+/g, '');
      const cleanActiveRegion = activeRegion.replace(/\s+/g, '');

      if (cleanActiveRegion.includes('/')) {
        const parts = cleanActiveRegion.split('/');
        return parts.some(
          (part) =>
            cleanProjectRegion.includes(part) ||
            part.includes(cleanProjectRegion),
        );
      }

      return (
        cleanProjectRegion.includes(cleanActiveRegion) ||
        cleanActiveRegion.includes(cleanProjectRegion)
      );
    });
  }, [activeRegion, projects]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(activePage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleRegionChange = (region: string) => {
    setActiveRegion(region);
    setActivePage(1);
  };

  if (!isFetched) {
    return <ProjectSkeletonGrid />;
  }

  return (
    <>
      <div className="flex w-full items-center gap-[clamp(1rem,2.5vw,1.5rem)] overflow-x-auto">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => handleRegionChange(region)}
            className={`shrink-0 text-[clamp(0.75rem,1.2vw,1.125rem)] whitespace-nowrap transition-colors ${
              activeRegion === region ? 'text-[#353535]' : 'text-[#9F9F9F]'
            }`}
          >
            {region}
          </button>
        ))}
      </div>
      <div className="grid w-full grid-cols-2 gap-x-[clamp(0.75rem,2vw,1.75rem)] gap-y-[clamp(1.5rem,4vw,3.5rem)] sm:grid-cols-3 lg:grid-cols-4">
        {paginated.map((project) => (
          <div key={project._id} className="group flex flex-col items-start">
            <Link
              href={`/projects/${project.urlTitle}`}
              className="relative aspect-square w-full cursor-pointer overflow-hidden shadow-[0px_16px_28.5px_0px_rgba(0,0,0,0.05)] lg:aspect-[353/419]"
            >
              {/* 배경 이미지 & 내부 그림자 효과 */}
              <div
                className="absolute inset-0 scale-105 bg-neutral-200 bg-cover bg-center shadow-[inset_-5px_1px_19px_0px_rgba(255,255,255,1.00)] transition-all duration-300 ease-out group-hover:scale-110 group-hover:blur-sm"
                style={{
                  backgroundImage: project.thumbnail
                    ? `url(${urlFor(project.thumbnail).width(600).url()})`
                    : 'none',
                }}
              />

              {/* 하단 그라데이션 오버레이 (호버 시 배경 어둡게 전환) */}
              <div className="absolute inset-0 bg-linear-to-b from-zinc-100/0 from-[55%] to-white/90 to-[92%] bg-blend-hard-light transition-all duration-300 group-hover:from-zinc-900/0 group-hover:to-zinc-900/80" />

              {/* 텍스트 영역 (시안의 좌표 및 스타일 반영, 호버 시 색상 반전) */}
              <div className="absolute bottom-4 left-[14px] z-10 flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-zinc-800 transition-colors duration-300 group-hover:text-white">
                  {project.title}
                </span>
                <div className="flex items-center gap-1 text-[9px] font-normal text-stone-500 transition-colors duration-300 group-hover:text-stone-300">
                  <span>{project.location}</span>
                  <span className="text-stone-300 transition-colors duration-300 group-hover:text-stone-500">
                    ㅣ
                  </span>
                  <span>{formatDate(project.completionDate)}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex w-full items-center justify-center gap-[clamp(0.5rem,1vw,0.75rem)]">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`text-[clamp(0.625rem,1vw,1rem)] ${safePage === page ? 'font-bold text-zinc-600' : 'font-normal text-neutral-500'}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

const ProjectSkeletonGrid = () => (
  <div className="flex w-full animate-pulse flex-col gap-6">
    <div className="h-6 w-full max-w-md rounded bg-neutral-200" />
    <div className="grid w-full grid-cols-2 gap-x-[clamp(0.75rem,2vw,1.75rem)] gap-y-[clamp(1.5rem,4vw,3.5rem)] sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="aspect-square w-full rounded bg-neutral-200 lg:aspect-[353/419]" />
          <div className="h-4 w-2/3 rounded bg-neutral-200" />
          <div className="h-3 w-1/2 rounded bg-neutral-100" />
        </div>
      ))}
    </div>
  </div>
);

const ProjectSection = () => {
  return (
    <section className="flex w-full flex-col items-start gap-[clamp(1.5rem,1.5vw,2.5rem)] px-[clamp(1.25rem,5vw,3rem)] py-[clamp(2.5rem,6vw,4rem)]">
      <h2 className="text-font-title text-[clamp(1.5rem,3vw,2.25rem)] font-semibold">
        프로젝트
      </h2>

      <Suspense fallback={<ProjectSkeletonGrid />}>
        <ProjectContent />
      </Suspense>
    </section>
  );
};

export default ProjectSection;
