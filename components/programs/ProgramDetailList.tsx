/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
'use client';

import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import Link from 'next/link';
import { getOpenhouseMainList } from '@/feature/programs/getOpenhouseMainList';
import { getWorkshopMainList } from '@/feature/programs/getWorkshopMainList';
import { urlFor } from '@/sanity/lib/image';

export type ProgramKind = 'workshop' | 'openHouse';

type Card = {
  _id: string;
  title: string;
  urlTitle: string;
  /** 정렬·연도 탭 기준 날짜 (YYYY-MM-DD) */
  date: string;
  /** 카드에 보여줄 기간 (오픈하우스: 2025.10.19-10.20) — 없으면 date 사용 */
  dateRange?: string;
  subtitle?: string;
  thumbnail: any;
};

/** 전체 목록 조회 함수 (연도 필터·페이지 나누기는 화면에서 처리) */
type FetchList = () => Promise<Card[]>;

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
    fetchList: getWorkshopMainList,
  },
  openHouse: {
    title: ['신규 프로젝트', '오픈하우스'],
    label: '오픈하우스',
    basePath: '/programs/openhouse',
    fetchList: getOpenhouseMainList,
  },
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
  /** 전체 목록 (최신순) */
  const [posts, setPosts] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  /** 화면 폭에 따른 한 페이지 개수 */
  const pageSize = useIsMobile() ? PAGE_SIZE_MOBILE : PAGE_SIZE;

  // 모바일 ↔ 데스크탑으로 바뀌면 1페이지로 (렌더 중 상태 조정 패턴)
  const [prevPageSize, setPrevPageSize] = useState(pageSize);
  if (prevPageSize !== pageSize) {
    setPrevPageSize(pageSize);
    setPage(1);
  }

  // 전체 목록은 처음 한 번만 불러옴 (연도·페이지·화면 폭이 바뀌어도 다시 요청하지 않음)
  useEffect(() => {
    let ignore = false;

    const fetchList = async () => {
      setLoading(true);
      try {
        const result = await config.fetchList();
        if (!ignore) setPosts(result ?? []);
      } catch (error) {
        console.error('프로그램 목록을 불러오지 못했습니다:', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchList();
    return () => {
      ignore = true;
    };
  }, [config]);

  /** 연도 탭: 게시물 날짜의 연도 (최신순) */
  const years = useMemo(
    () =>
      [...new Set(posts.map((p) => p.date?.slice(0, 4)).filter(Boolean))].sort(
        (a, b) => b.localeCompare(a),
      ),
    [posts],
  );

  /** 선택한 연도의 게시물 */
  const filtered = useMemo(
    () => (year ? posts.filter((p) => p.date?.startsWith(year)) : posts),
    [posts, year],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  /** 현재 페이지에 보여줄 게시물 */
  const items = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  // 항상 한 페이지 개수(모바일 4 · 그 외 8)만큼 자리를 차지하도록 빈 칸 추가
  const emptySlots = Math.max(0, pageSize - items.length);

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
      {loading ? (
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
          {items.map((post) => (
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
          {items.length === 0 && (
            <li className="absolute inset-0 flex items-center justify-center text-[clamp(0.75rem,1.2vw,1rem)] text-neutral-400">
              등록된 게시물이 없습니다.
            </li>
          )}
        </ul>
      )}

      {/* 페이지네이션: 목록이 없어도 항상 표시 */}
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onChange={setPage}
      />
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
  const { title, date, dateRange, subtitle, thumbnail } = post;
  // 오픈하우스는 회차 기간(2025.10.19-10.20), 워크샵은 날짜(2026.06.13)
  const meta = [dateRange || formatDate(date), subtitle]
    .filter(Boolean)
    .join(' ');

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
