/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
'use client';

import {
  type ReactNode,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import Link from 'next/link';
// import { getOpenHouseList } from '@/feature/programs/openHouse/getOpenHouseData';
import { getWorkshopList } from '@/feature/programs/getWorkshopData';
import { urlFor } from '@/sanity/lib/image';

// TODO: 오픈하우스 작업 시 'openHouse' 추가
export type ProgramKind = 'workshop'; // | 'openHouse';

type Card = {
  _id: string;
  title: string;
  urlTitle: string;
  date: string;
  subtitle?: string;
  thumbnail: any;
};

type ListResult = { items: Card[]; total: number; dates: string[] };

type FetchList = (params: {
  year: string;
  page: number;
  pageSize: number;
}) => Promise<ListResult>;

/** 프로그램별 설정: 제목 · 카드 라벨 · 상세 주소 · 데이터 조회 함수 */
const PROGRAM_CONFIG: Record<
  ProgramKind,
  {
    title: [string, string];
    label: string;
    basePath: string;
    fetchList: FetchList;
  }
> = {
  workshop: {
    title: ['몸건축 워크샵', '원주 오픈하우스'],
    label: '워크샵',
    basePath: '/programs/workshop',
    fetchList: getWorkshopList,
  },
  // TODO: 오픈하우스 작업 시 주석 해제
  // openHouse: {
  //   title: ['신규 프로젝트', '오픈하우스'],
  //   label: '오픈하우스',
  //   basePath: '/programs/newProject',
  //   fetchList: getOpenHouseList,
  // },
};

/** 한 페이지 개수: 모바일(1열) 최대 4개 · 그 외 8개 */
const PAGE_SIZE = 8;
const PAGE_SIZE_MOBILE = 4;

/** Tailwind sm(640px) 미만 = 모바일 */
const MOBILE_QUERY = '(max-width: 639px)';

/** 화면이 모바일 폭인지 (창 크기가 바뀌면 자동으로 다시 계산) */
const subscribeMobile = (onChange: () => void) => {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};
const useIsMobile = () =>
  useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false, // 서버 렌더링 시에는 데스크탑 기준
  );
/** 페이지 번호를 몇 개씩 보여줄지 */
const PAGE_GROUP = 4;

const formatDate = (date?: string) => date?.replaceAll('-', '.') ?? '';

/*
  ProjectSection과 같은 틀
  - section 여백·간격, 제목 크기, 필터 탭 글자·색·간격
  - 카드 그리드: 모바일 1열(최대 4개) → sm 3열 → lg 4열(8개), 같은 가로·세로 간격
  - 페이지 번호 글자·간격
*/

/** 카드 그리드 (실제 목록 · 스켈레톤 공통) */
const GRID_CLASS =
  'relative grid w-full grid-cols-1 gap-x-[clamp(0.75rem,2vw,1.75rem)] gap-y-[clamp(1.5rem,4vw,3.5rem)] sm:grid-cols-3 lg:grid-cols-4';

/** 필터 탭 줄 */
const TABS_CLASS =
  'flex w-full items-center gap-[clamp(1rem,2.5vw,1.5rem)] overflow-x-auto';

/** 필터 탭 글자 */
const TAB_TEXT = 'text-[clamp(0.75rem,1.2vw,1.125rem)]';

const ProgramDetailList = ({ program }: { program: ProgramKind }) => {
  const config = PROGRAM_CONFIG[program];

  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ListResult>({
    items: [],
    total: 0,
    dates: [],
  });
  const [loading, setLoading] = useState(true);
  /** 첫 응답을 받았는지 (연도 탭 스켈레톤 표시용) */
  const [initialized, setInitialized] = useState(false);

  /** 화면 폭에 따른 한 페이지 개수 */
  const pageSize = useIsMobile() ? PAGE_SIZE_MOBILE : PAGE_SIZE;

  // 모바일 ↔ 데스크탑으로 바뀌면 1페이지로 (렌더 중 상태 조정 패턴)
  const [prevPageSize, setPrevPageSize] = useState(pageSize);
  if (prevPageSize !== pageSize) {
    setPrevPageSize(pageSize);
    setPage(1);
  }

  useEffect(() => {
    let ignore = false; // 연도/페이지를 빠르게 바꿀 때 이전 응답이 덮어쓰지 않도록

    const fetchList = async () => {
      setLoading(true);
      try {
        const result = await config.fetchList({
          year,
          page,
          pageSize,
        });
        if (!ignore) setData(result);
      } catch (error) {
        console.error('프로그램 목록을 불러오지 못했습니다:', error);
      } finally {
        if (!ignore) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    fetchList();
    return () => {
      ignore = true;
    };
  }, [config, year, page, pageSize]);

  const years = [...new Set(data.dates.map((d) => d.slice(0, 4)))].sort(
    (a, b) => b.localeCompare(a),
  );
  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));
  // 항상 한 페이지 개수(모바일 4 · 그 외 8)만큼 자리를 차지하도록 빈 칸 추가
  const emptySlots = Math.max(0, pageSize - data.items.length);

  const handleYearChange = (y: string) => {
    setYear(y);
    setPage(1);
  };

  return (
    <section className="flex w-full flex-col items-start gap-[clamp(1.5rem,1.5vw,2.5rem)] px-[clamp(1.25rem,5vw,3rem)] py-[clamp(2.5rem,6vw,4rem)]">
      <h1 className="section-title leading-1.4 text-left text-[clamp(1.5rem,3vw,2.25rem)] font-semibold">
        {config.title[0]}
        <br />
        {config.title[1]}
      </h1>

      {/* 연도 필터 */}
      {!initialized ? (
        // 첫 로딩: 실제 탭과 같은 글자 높이의 회색 막대
        <div aria-busy className={`${TABS_CLASS} ${TAB_TEXT} animate-pulse`}>
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className="inline-block w-[2.4em] shrink-0 bg-neutral-200 text-transparent"
            >
              0000
            </span>
          ))}
        </div>
      ) : (
        <div role="group" aria-label="연도 선택" className={TABS_CLASS}>
          {['', ...years].map((y) => (
            <button
              key={y || 'all'}
              type="button"
              onClick={() => handleYearChange(y)}
              aria-pressed={y === year}
              className={`shrink-0 whitespace-nowrap transition-colors ${TAB_TEXT} ${
                y === year ? 'text-[#353535]' : 'text-[#9F9F9F]'
              }`}
            >
              {y || '전체'}
            </button>
          ))}
        </div>
      )}

      {/* 게시물: 데이터 개수와 상관없이 항상 한 페이지 분량 높이 */}
      {loading ? (
        <PostGridSkeleton />
      ) : (
        <ul className={GRID_CLASS}>
          {data.items.map((post) => (
            <li key={post._id}>
              <PostCard
                post={post}
                label={config.label}
                href={`${config.basePath}/${post.urlTitle}`}
              />
            </li>
          ))}

          {/* 빈 칸: 보이지 않지만 카드와 같은 크기로 자리 차지 */}
          {Array.from({ length: emptySlots }, (_, i) => (
            <li key={`empty-${i}`} aria-hidden className="invisible">
              <CardFrame />
            </li>
          ))}

          {/* 게시물이 하나도 없을 때 안내 (자리를 차지하지 않고 위에 겹침) */}
          {data.items.length === 0 && (
            <li className="absolute inset-0 flex items-center justify-center text-[clamp(0.75rem,1.2vw,1rem)] text-neutral-400">
              등록된 게시물이 없습니다.
            </li>
          )}
        </ul>
      )}

      {/* 페이지네이션: 목록이 없어도 항상 표시 */}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </section>
  );
};

/** 카드 틀 (실제 카드 · 빈 칸 · 스켈레톤이 같은 크기를 갖도록 공통 사용) */
const CardFrame = ({
  image,
  label = ' ',
  title = ' ',
  meta = ' ',
  skeleton = false,
}: {
  image?: ReactNode;
  label?: string;
  title?: string;
  meta?: string;
  /** 로딩 중 회색 막대로 표시 */
  skeleton?: boolean;
}) => {
  const bar = (width: string) =>
    skeleton ? `inline-block ${width} bg-neutral-200 text-transparent` : '';

  return (
    <>
      {/* 이미지: 모바일 시안의 가로형(336:174) → sm 이상 정사각형 */}
      <div
        className={`relative aspect-[336/174] w-full overflow-hidden shadow-[0px_16px_28.5px_0px_rgba(0,0,0,0.05)] sm:aspect-square ${
          skeleton ? 'bg-neutral-200' : 'bg-zinc-100'
        }`}
      >
        {image}
      </div>

      {/* 순서: 모바일 [제목·날짜·라벨] / 데스크탑 [라벨·제목·날짜] */}
      {/* 모바일 시안: 이미지·제목·날짜·라벨 사이 10px */}
      <div className="mt-2.5 flex flex-col gap-2.5 px-[clamp(0px,0.8vw,0.75rem)] sm:mt-[clamp(0.5rem,0.8vw,0.875rem)] sm:gap-[clamp(0.25rem,0.4vw,0.5rem)]">
        <p className="order-3 truncate text-[clamp(0.5625rem,0.75vw,0.75rem)] text-zinc-500 lg:order-1">
          <span className={bar('w-1/4')}>{label}</span>
        </p>
        <h2 className="leading-1.4 order-1 line-clamp-2 text-[clamp(0.75rem,1.2vw,1.25rem)] font-semibold text-zinc-800 lg:order-2 lg:whitespace-pre-line lg:text-neutral-600">
          <span className={bar('w-2/3')}>{title}</span>
        </h2>
        <p className="order-2 truncate text-[clamp(0.5625rem,0.75vw,0.75rem)] text-neutral-500 lg:order-3">
          <span className={bar('w-1/2')}>{meta}</span>
        </p>
      </div>
    </>
  );
};

const PostCard = ({
  post,
  label,
  href,
}: {
  post: Card;
  label: string;
  href: string;
}) => {
  const { title, date, subtitle, thumbnail } = post;
  const meta = [formatDate(date), subtitle].filter(Boolean).join(' ');

  return (
    <Link href={href} className="group flex flex-col">
      <CardFrame
        label={label}
        title={title}
        meta={meta || ' '}
        image={
          thumbnail && (
            <img
              src={urlFor(thumbnail).width(800).auto('format').url()}
              alt={title}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          )
        }
      />
    </Link>
  );
};

/** 로딩 중에도 한 페이지 분량 높이 유지 (모바일은 4칸만 보이도록 CSS로 처리) */
const PostGridSkeleton = () => (
  <ul aria-busy className={`${GRID_CLASS} animate-pulse`}>
    {Array.from({ length: PAGE_SIZE }, (_, i) => (
      <li
        key={i}
        className={i >= PAGE_SIZE_MOBILE ? 'max-sm:hidden' : undefined}
      >
        <CardFrame skeleton />
      </li>
    ))}
  </ul>
);

const Pagination = ({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) => {
  const groupStart = Math.floor((page - 1) / PAGE_GROUP) * PAGE_GROUP + 1;
  const groupEnd = Math.min(groupStart + PAGE_GROUP - 1, totalPages);
  const pages = Array.from(
    { length: groupEnd - groupStart + 1 },
    (_, i) => groupStart + i,
  );
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  // ProjectSection과 같은 글자·간격, 목록이 없어도 번호와 화살표는 항상 표시
  return (
    <nav
      aria-label="페이지"
      className="flex w-full items-center justify-center gap-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.625rem,1vw,1rem)]"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={!hasPrev}
        aria-label="이전 페이지"
        className="p-1 disabled:cursor-default disabled:opacity-30"
      >
        <Chevron className="rotate-180" />
      </button>
      {pages.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-current={n === page ? 'page' : undefined}
          className={
            n === page
              ? 'font-bold text-zinc-600'
              : 'font-normal text-neutral-500'
          }
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={!hasNext}
        aria-label="다음 페이지"
        className="p-1 disabled:cursor-default disabled:opacity-30"
      >
        <Chevron />
      </button>
    </nav>
  );
};

/** 크기를 em으로 잡아 페이지 번호 글자 크기에 맞춰 함께 변함 */
const Chevron = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 6 10"
    fill="none"
    aria-hidden
    className={`h-[0.7em] w-[0.45em] stroke-zinc-400 ${className}`}
  >
    <path
      d="M1 1l4 4-4 4"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ProgramDetailList;
