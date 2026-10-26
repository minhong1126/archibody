import Image from 'next/image';
import Link from 'next/link';
import { defineQuery } from 'next-sanity';
import { client } from '@/sanity/lib/client'; // 프로젝트의 client 경로에 맞게 수정

/** 3열·4열 모두 딱 떨어지도록 12개 */
const PAGE_SIZE = 12;
/** 페이지 번호를 몇 개씩 보여줄지 */
const PAGE_GROUP = 5;

type Category = 'workshop' | 'openHouse' | 'notice';

type Post = {
  _id: string;
  category: Category;
  title: string;
  date?: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
};

type QueryResult = { items: Post[]; total: number; dates: string[] };

const CATEGORY_LABEL: Record<Category, string> = {
  workshop: '워크샵',
  openHouse: '오픈하우스',
  notice: '공지',
};

const FILTER = `_type == "programPost" && program == $program && ($year == "" || (date >= $from && date < $to))`;

const POSTS_QUERY = defineQuery(`{
  "items": *[${FILTER}] | order(date desc) [$start...$end] {
    _id, category, title, date, subtitle,
    "imageUrl": thumbnail.asset->url,
    "imageAlt": thumbnail.alt
  },
  "total": count(*[${FILTER}]),
  "dates": *[_type == "programPost" && program == $program && defined(date)].date
}`);

const formatDate = (date?: string) => date?.replaceAll('-', '.');

type Props = {
  program: string;
  basePath: string;
  title: readonly [string, string];
  year: string;
  page: number;
};

const ProgramDetailList = async ({
  program,
  basePath,
  title,
  year,
  page,
}: Props) => {
  const start = (page - 1) * PAGE_SIZE;

  const { items, total, dates } = await client.fetch<QueryResult>(
    POSTS_QUERY,
    {
      program,
      year,
      from: year ? `${year}-01-01` : '',
      to: year ? `${Number(year) + 1}-01-01` : '',
      start,
      end: start + PAGE_SIZE,
    },
    { next: { revalidate: 60 } }, // Studio 수정 후 최대 60초 내 반영
  );

  const years = [...new Set(dates.map((d) => d.slice(0, 4)))].sort((a, b) =>
    b.localeCompare(a),
  );
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const hrefFor = (next: { year?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (next.year) q.set('year', next.year);
    if (next.page && next.page > 1) q.set('page', String(next.page));
    const qs = q.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <section className="mx-auto w-full max-w-96 px-6 pt-7 pb-20 lg:box-content lg:max-w-[1481px] lg:px-10 lg:pt-20 lg:pb-[137px] xl:px-16">
      <h1 className="text-center text-base leading-6 font-semibold text-zinc-800 lg:text-left lg:text-4xl lg:leading-[53px]">
        {title[0]}
        <br />
        {title[1]}
      </h1>

      {/* 연도 필터 */}
      <nav
        aria-label="연도 선택"
        className="-mx-6 mt-14 overflow-x-auto px-6 lg:mx-0 lg:mt-[79px] lg:overflow-visible lg:border-b lg:border-gray-200 lg:px-0 lg:pb-[18px]"
      >
        <ul className="flex w-max min-w-full justify-between gap-3 lg:w-auto lg:justify-start lg:gap-7">
          {['', ...years].map((y) => {
            const active = y === year;
            return (
              <li key={y || 'all'}>
                <Link
                  href={hrefFor({ year: y })}
                  aria-current={active ? 'page' : undefined}
                  className={`text-xs transition-colors lg:text-lg ${
                    active
                      ? 'text-neutral-700'
                      : 'text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  {y || '전체'}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 게시물 */}
      {items.length > 0 ? (
        <ul className="mt-16 grid grid-cols-1 gap-y-9 lg:mt-6 lg:grid-cols-3 lg:gap-x-[22px] lg:gap-y-14 xl:grid-cols-4">
          {items.map((post) => (
            <li key={post._id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-16 text-center text-xs text-neutral-400 lg:mt-24 lg:text-base">
          등록된 게시물이 없습니다.
        </p>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          hrefFor={(p) => hrefFor({ year, page: p })}
        />
      )}
    </section>
  );
};

function PostCard({ post }: { post: Post }) {
  const { category, title, date, subtitle, imageUrl, imageAlt } = post;
  const meta = [formatDate(date), subtitle].filter(Boolean).join(' ');

  return (
    <article className="flex flex-col">
      <div className="relative aspect-[336/174] w-full overflow-hidden bg-zinc-100 shadow-[0px_16px_28.5px_0px_rgba(0,0,0,0.05)] lg:aspect-square">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            sizes="(min-width: 1280px) 353px, (min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        )}
      </div>

      {/* 순서: 모바일 [제목·날짜·분류] / 데스크탑 [분류·제목·날짜] */}
      <div className="mt-2.5 flex flex-col gap-2 lg:mt-3.5 lg:gap-1.5 lg:px-3">
        <p className="order-3 text-[9px] text-zinc-500 lg:order-1 lg:text-xs">
          {CATEGORY_LABEL[category] ?? ''}
        </p>
        <h2 className="order-1 text-xs leading-4 font-semibold text-zinc-800 lg:order-2 lg:text-xl lg:leading-7 lg:whitespace-pre-line lg:text-neutral-600">
          {title}
        </h2>
        {meta && (
          <p className="order-2 text-[9px] text-neutral-500 lg:order-3 lg:text-xs">
            {meta}
          </p>
        )}
      </div>
    </article>
  );
}

function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  const groupStart = Math.floor((page - 1) / PAGE_GROUP) * PAGE_GROUP + 1;
  const groupEnd = Math.min(groupStart + PAGE_GROUP - 1, totalPages);
  const pages = Array.from(
    { length: groupEnd - groupStart + 1 },
    (_, i) => groupStart + i,
  );

  return (
    <nav
      aria-label="페이지"
      className="mt-16 flex items-center justify-center gap-2 text-[10px] lg:mt-24 lg:gap-5 lg:text-base"
    >
      {groupStart > 1 && (
        <Link
          href={hrefFor(groupStart - 1)}
          aria-label="이전 페이지"
          className="p-1"
        >
          <Chevron className="rotate-180" />
        </Link>
      )}
      {pages.map((n) => (
        <Link
          key={n}
          href={hrefFor(n)}
          aria-current={n === page ? 'page' : undefined}
          className={
            n === page
              ? 'font-bold text-zinc-600'
              : 'text-neutral-500 hover:text-zinc-600'
          }
        >
          {n}
        </Link>
      ))}
      {groupEnd < totalPages && (
        <Link
          href={hrefFor(groupEnd + 1)}
          aria-label="다음 페이지"
          className="p-1"
        >
          <Chevron />
        </Link>
      )}
    </nav>
  );
}

function Chevron({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 6 10"
      fill="none"
      aria-hidden
      className={`h-2 w-1.5 stroke-zinc-400 lg:h-3.5 lg:w-2 ${className}`}
    >
      <path
        d="M1 1l4 4-4 4"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ProgramDetailList;
