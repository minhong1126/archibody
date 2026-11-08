/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PortableText, type PortableTextComponents } from 'next-sanity';
import {
  getWorkshopDetailData,
  type WorkshopDetail as WorkshopDetailData,
} from '@/feature/programs/getWorkshopDetailData';
import { urlFor } from '@/sanity/lib/image';

/** 2026-06-13 → 2026.06.13 */
const formatDot = (date?: string) => date?.replaceAll('-', '.') ?? '';

/** ISO 일시 → 한국 시간 기준 { 날짜: 2026년 6월 13일 (토), 시간: 14:00 } */
const kstParts = (iso: string) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value]),
  );
  return {
    day: `${parts.year}년 ${parts.month}월 ${parts.day}일 (${parts.weekday})`,
    time: `${parts.hour}:${parts.minute}`,
  };
};

/**
  시작·종료 일시 → 2026년 6월 13일 (토) 14:00 - 17:00
  종료가 다른 날이면 → 2026년 6월 13일 (토) 14:00 - 2026년 6월 14일 (일) 12:00
  예전 게시물(날짜만 입력)은 시간 없이 날짜만 표시
*/
const formatSchedule = (startAt?: string, endAt?: string) => {
  if (!startAt) return '';
  const start = kstParts(startAt);
  const dateOnly =
    !startAt.includes('T') || startAt.endsWith('T00:00:00+09:00');
  if (dateOnly && !endAt) return start.day;

  const startText = `${start.day} ${start.time}`;
  if (!endAt) return startText;

  const end = kstParts(endAt);
  return end.day === start.day
    ? `${startText} - ${end.time}`
    : `${startText} - ${end.day} ${end.time}`;
};

/** 본문(에디터) 서식 → 스타일 */
const bodyComponents: PortableTextComponents = {
  block: {
    // 빈 줄도 한 줄 높이를 유지
    normal: ({ children }) => <p className="min-h-[1lh]">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-[1.2em] text-[1.25em] font-semibold text-zinc-800">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-[1em] text-[1.1em] font-semibold text-zinc-800">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-[0.6em] border-l-2 border-neutral-300 pl-[1em] text-neutral-500">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-[1.4em]">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-[1.4em]">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    'strike-through': ({ children }) => (
      <span className="line-through">{children}</span>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        {...(value?.blank && { target: '_blank', rel: 'noopener noreferrer' })}
        className="underline underline-offset-2 hover:text-zinc-900"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) =>
      value?.asset ? (
        <figure className="my-[1em]">
          <img
            src={urlFor(value).width(1200).auto('format').url()}
            alt={value.alt ?? ''}
            loading="lazy"
            className="w-full"
          />
          {value.caption && (
            <figcaption className="mt-[0.4em] text-[0.8em] text-neutral-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null,
  },
};

/** 공통 레이아웃: 좌우 여백 37px → 231px (1920px에서 내용 폭 1458px) */
const SECTION_CLASS =
  'mx-auto w-full max-w-[1920px] px-[clamp(37px,12.63vw_-_11.5px,231px)] pb-[clamp(56px,7vw,137px)]';

/** 단계 카드 그리드: 모바일·태블릿 1열 → 데스크탑 한 줄에 전부 (개수만큼 균등 분할), 폭은 섹션 여백 안 */
const STEPS_GRID_CLASS =
  'mt-[clamp(46px,30.75px_+_3.97vw,107px)] grid grid-cols-1 gap-[clamp(10px,7.5px_+_0.65vw,20px)] lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none';

/**
  일시·본문·문의 영역: 프로그램 정보보다 항상 안쪽으로 들어가도록 좌우 추가 여백
  12px → 229px (1920px에서 내용 폭 1000px)
*/
const INFO_INSET = 'px-[clamp(12px,14.13vw_-_42.25px,229px)]';

/** 프로그램 정보 → 일시 영역 간격: 64px → 154px */
const INFO_TOP_GAP = 'mt-[clamp(64px,41.5px_+_5.86vw,154px)]';

const WorkshopDetail = () => {
  const params = useParams<{ urlTitle: string }>();
  const urlTitle = params?.urlTitle ? decodeURIComponent(params.urlTitle) : '';

  const [post, setPost] = useState<WorkshopDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 주소에서 값을 못 읽어도 로딩이 끝나도록
    if (!urlTitle) {
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setPost(await getWorkshopDetailData(urlTitle));
      } catch (error) {
        console.error('워크샵 상세 데이터를 불러오지 못했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [urlTitle]);

  if (loading) return <WorkshopDetailSkeleton />;

  if (!post) {
    return (
      <div className="w-full py-[clamp(80px,10vw,144px)] text-center text-[clamp(13px,11px_+_0.52vw,18px)] text-neutral-400">
        해당 게시물을 찾을 수 없습니다.
      </div>
    );
  }

  const infoItems = [
    // 일시는 항상 표시 (시작 일시가 없으면 예전 날짜 → 그것도 없으면 '-')
    {
      label: '일시',
      value: formatSchedule(post.startAt ?? post.date, post.endAt) || '-',
    },
    { label: '장소', value: post.place },
    { label: '인원', value: post.capacity },
    { label: '참가비', value: post.fee },
  ].filter((item) => item.value);

  return (
    <article className={SECTION_CLASS}>
      <header className="mx-auto flex max-w-64 flex-col items-center text-center lg:max-w-none lg:flex-row lg:items-start lg:justify-between lg:gap-[clamp(16px,2vw,40px)] lg:text-left">
        {/* 제목 + 부제: 세로 */}
        <div className="flex flex-col items-center lg:items-start">
          <h1 className="mb-2.5 text-[clamp(16px,11px_+_1.3vw,36px)] leading-normal font-semibold whitespace-pre-line text-zinc-800 lg:mb-[clamp(8px,0.8vw,16px)] lg:leading-none lg:text-neutral-800">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="leading-2.8 lg:leading-1.2 text-[clamp(10px,8px_+_0.52vw,18px)] text-neutral-500 lg:text-zinc-800">
              {post.subtitle}
            </p>
          )}
        </div>

        {/* 날짜: 모바일은 부제 아래, 데스크탑은 오른쪽 끝 */}
        <p className="leading-2.8 lg:leading-1.2 shrink-0 text-[clamp(10px,8px_+_0.52vw,18px)] text-neutral-500 lg:text-zinc-500">
          {formatDot(post.date)}
        </p>
      </header>

      {/* 포스터: 모바일 332px → 데스크탑 836px */}
      {post.thumbnail && (
        <div className="mx-auto mt-[clamp(40px,10px_+_7.75vw,159px)] aspect-square w-full max-w-209 overflow-hidden shadow-[0px_16px_28.5px_0px_rgba(0,0,0,0.05)]">
          <img
            src={urlFor(post.thumbnail).width(1600).auto('format').url()}
            alt={post.thumbnail.alt ?? post.title}
            className="size-full object-cover"
          />
        </div>
      )}

      {/* 프로그램 정보 */}
      {post.steps && post.steps.length > 0 && (
        <section className="mt-[clamp(57px,34px_+_6vw,149px)]">
          <h2 className="text-center text-[clamp(16px,11px_+_1.3vw,36px)] font-semibold text-zinc-800 lg:text-neutral-800">
            프로그램 정보
          </h2>
          <ol className={STEPS_GRID_CLASS}>
            {post.steps.map((step) => (
              <li
                key={step._key}
                className="flex flex-col overflow-hidden rounded-[10px] bg-zinc-400/50"
              >
                {/* 머리: 24px → 64px */}
                <p className="flex h-[clamp(24px,14px_+_2.6vw,64px)] shrink-0 items-center justify-center text-[clamp(12px,9px_+_0.78vw,24px)] font-semibold text-zinc-800">
                  {step.title}
                </p>
                {/* 몸통: 56px → 128px */}
                <p className="flex min-h-[clamp(56px,38px_+_4.69vw,128px)] flex-1 items-center justify-center bg-neutral-50 px-[0.8em] py-[0.4em] text-center text-[clamp(12px,10px_+_0.52vw,20px)] leading-[clamp(16px,11px_+_1.04vw,32px)] font-medium whitespace-pre-line text-zinc-700">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 일시·장소·인원·참가비 + 본문 + 문의: 프로그램 정보보다 안쪽, 글은 왼쪽 정렬 */}
      <div
        className={`flex w-full flex-col items-start gap-[clamp(64px,48px_+_4.17vw,128px)] text-left ${INFO_INSET} ${INFO_TOP_GAP}`}
      >
        {/* 일시·장소 등의 설명 */}
        {infoItems.length > 0 && (
          <dl className="leading-1.4 flex flex-col gap-[clamp(20px,19px_+_0.26vw,24px)] text-[clamp(12px,10px_+_0.52vw,20px)]">
            {infoItems.map(({ label, value }) => (
              <div key={label} className="flex">
                {/* 라벨 칸: 36px → 80px */}
                <dt className="w-[clamp(36px,25px_+_2.87vw,80px)] shrink-0 font-medium text-zinc-800 lg:font-semibold">
                  {label}
                </dt>
                <dd className="min-w-0 text-neutral-600">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {post.body && post.body.length > 0 && (
          <div className="text-[clamp(12px,9px_+_0.78vw,24px)] leading-[clamp(16px,10px_+_1.5625vw,40px)] break-keep text-neutral-700">
            <PortableText value={post.body} components={bodyComponents} />
          </div>
        )}

        {/* 신청 및 문의 (모든 게시물 공통) */}
        <address className="text-[clamp(12px,9px_+_0.78vw,24px)] leading-[clamp(16px,11px_+_1.302vw,36px)] text-neutral-700 not-italic">
          신청 및 문의:
          <br />
          건축사사무소 몸 대표 <strong className="font-semibold">임보라</strong>
          <br />
          <br />
          <a href="tel:010-2338-6557" className="hover:underline">
            T. 010-2338-6557
          </a>
          <br />
          <a
            href="mailto:architecturebody@gmail.com"
            className="hover:underline"
          >
            E. architecturebody@gmail.com
          </a>
        </address>
      </div>
    </article>
  );
};

/** 로딩 중 스켈레톤 (실제 레이아웃과 같은 크기·간격) */
const WorkshopDetailSkeleton = () => (
  <article aria-busy className={`${SECTION_CLASS} animate-pulse`}>
    {/* 머리말 */}
    <div className="mx-auto flex max-w-64 flex-col items-center gap-2.5 lg:max-w-none lg:flex-row lg:items-start lg:justify-between">
      <div className="h-[clamp(24px,11px_+_1.3vw,36px)] w-[clamp(160px,22vw,384px)] bg-neutral-200" />
      <div className="h-[clamp(12px,8px_+_0.52vw,18px)] w-[clamp(120px,15vw,288px)] bg-neutral-200" />
      <div className="hidden h-[clamp(12px,8px_+_0.52vw,18px)] w-[clamp(60px,5vw,96px)] bg-neutral-200 lg:block" />
    </div>

    {/* 포스터 */}
    <div className="mx-auto mt-[clamp(40px,10px_+_7.75vw,159px)] aspect-square w-full max-w-209 bg-neutral-200" />

    {/* 프로그램 정보 */}
    <div className="mx-auto mt-[clamp(57px,34px_+_6vw,149px)] h-[clamp(16px,11px_+_1.3vw,36px)] w-[clamp(100px,11vw,208px)] bg-neutral-200" />
    <div className={STEPS_GRID_CLASS}>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="h-[clamp(80px,52px_+_7.29vw,192px)] rounded-[10px] bg-neutral-200"
        />
      ))}
    </div>

    {/* 일시·장소 등 */}
    <div
      className={`flex w-full flex-col gap-[clamp(20px,19px_+_0.26vw,24px)] ${INFO_INSET} ${INFO_TOP_GAP}`}
    >
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="h-[clamp(12px,10px_+_0.52vw,20px)] w-3/5 bg-neutral-200"
        />
      ))}
    </div>
  </article>
);

export default WorkshopDetail;
