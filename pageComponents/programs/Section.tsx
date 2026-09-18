'use client';

import { useMemo, useState } from 'react';

type Project = {
  id: string;
  title: string;
  location: string;
  date: string;
  region: string;
};

const projects: Project[] = [
  {
    id: '1',
    title: '다정한 집',
    location: '원주시 산현리',
    date: '2026.04',
    region: '강원',
  },
  {
    id: '2',
    title: '소수원',
    location: '세종시 반곡동',
    date: '2025.12',
    region: '기타',
  },
  {
    id: '3',
    title: '유담헌',
    location: '세종시 반곡동',
    date: '2025.04',
    region: '기타',
  },
  {
    id: '4',
    title: '토닥쓰담집',
    location: '세종시 반곡동',
    date: '2025.05',
    region: '기타',
  },
  {
    id: '5',
    title: '원주 서곡리 주택',
    location: '원주시 판부면 서곡리',
    date: '2023.11',
    region: '강원',
  },
  {
    id: '6',
    title: '양평 삼성리 주택',
    location: '양평군 삼성리',
    date: '2023.10',
    region: '경기',
  },
  {
    id: '7',
    title: '구례 월전리 주택',
    location: '구례군 문척면 월전리',
    date: '2024.06',
    region: '전남/전북',
  },
  {
    id: '8',
    title: '파주 운천리 D',
    location: '파주시 운천리',
    date: '2022.02',
    region: '경기',
  },
  {
    id: '9',
    title: '원주 관설동 주택',
    location: '원주시 관설동',
    date: '2023.06',
    region: '강원',
  },
  {
    id: '10',
    title: '파주 운천리 F',
    location: '파주시 운천리',
    date: '2022.08',
    region: '경기',
  },
  {
    id: '11',
    title: '감꽃홍시',
    location: '남원시 산내면',
    date: '2023.11',
    region: '전남/전북',
  },
  {
    id: '12',
    title: '숲 속의 집',
    location: '용인시 봉무리',
    date: '2022.06',
    region: '경기',
  },
];

const regions = ['전체', '경기', '강원', '충남/충북', '전남/전북', '기타'];
const PAGE_SIZE = 8;

const ProjectSection = () => {
  const [activeRegion, setActiveRegion] = useState('전체');
  const [activePage, setActivePage] = useState(1);

  const filtered = useMemo(
    () =>
      activeRegion === '전체'
        ? projects
        : projects.filter((p) => p.region === activeRegion),
    [activeRegion],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // 현재 페이지가 총 페이지 수를 넘어가면(필터 변경 등으로) 마지막 페이지로 보정
  const safePage = Math.min(activePage, totalPages);

  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleRegionChange = (region: string) => {
    setActiveRegion(region);
    setActivePage(1); // 필터 바뀌면 1페이지로 리셋
  };

  return (
    <section className="flex w-full flex-col items-start gap-[clamp(1.5rem,3vw,2.5rem)] px-[clamp(1.25rem,5vw,3rem)] py-[clamp(2.5rem,6vw,4rem)]">
      <h2 className="text-font-main text-[clamp(1.5rem,3vw,2.25rem)] font-semibold">
        프로젝트
      </h2>

      {/* 지역 필터 탭 */}
      <div className="scrollbar-hide flex w-full items-center gap-[clamp(1rem,2.5vw,1.5rem)] overflow-x-auto">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => handleRegionChange(region)}
            className={`shrink-0 text-[clamp(0.75rem,1.2vw,1.125rem)] whitespace-nowrap transition-colors ${
              activeRegion === region
                ? 'font-normal text-neutral-700'
                : 'font-normal text-neutral-400 hover:text-neutral-500'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* 프로젝트 그리드 */}
      <div className="grid w-full grid-cols-2 gap-x-[clamp(0.75rem,2vw,1.75rem)] gap-y-[clamp(1.5rem,4vw,3.5rem)] sm:grid-cols-3 lg:grid-cols-4">
        {paginated.map((project) => (
          <div
            key={project.id}
            className="group flex flex-col items-start gap-[clamp(0.375rem,0.8vw,0.625rem)]"
          >
            {/* 이미지: hover 시 블러 */}
            <div className="relative aspect-square w-full cursor-pointer overflow-hidden shadow-[0px_16px_28.5px_0px_rgba(0,0,0,0.05)] lg:aspect-[353/419]">
              <div className="absolute inset-0 scale-105 bg-neutral-200 transition-all duration-300 ease-out group-hover:scale-110 group-hover:blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-100/0 from-55% to-white/90 to-92%" />
            </div>

            <div className="flex flex-col items-start gap-0.5">
              <span className="text-[clamp(0.75rem,1.2vw,1.25rem)] font-semibold text-zinc-800">
                {project.title}
              </span>
              <div className="flex items-center gap-1 text-[clamp(0.5625rem,0.9vw,0.75rem)] font-normal text-stone-500">
                <span>{project.location}</span>
                <span className="text-stone-300">ㅣ</span>
                <span>{project.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션: 데이터 개수만큼 자동 생성, 1개 이하면 숨김 */}
      {totalPages > 1 && (
        <div className="flex w-full items-center justify-center gap-[clamp(0.5rem,1vw,0.75rem)]">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`text-[clamp(0.625rem,1vw,1rem)] ${
                safePage === page
                  ? 'font-bold text-zinc-600'
                  : 'font-normal text-neutral-500'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectSection;
