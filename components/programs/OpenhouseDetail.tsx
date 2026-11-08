/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PortableText, type PortableTextComponents } from 'next-sanity';
import {
  getOpenhouseDetailData,
  type OpenhouseBlockItem,
  type OpenhouseDetail as OpenhouseDetailData,
} from '@/feature/programs/getOpenhouseDetailData';
import { urlFor } from '@/sanity/lib/image';

/*
  시안 기준: 모바일 384px · 데스크탑 1920px
  WorkshopDetail과 같은 틀 (여백·머리말·포스터·일시 영역)
  모든 크기·간격은 두 시안 값 사이를 창 너비에 따라 연속적으로 변함 (clamp)

  | 요소                    | 모바일 → 데스크탑 |
  | 제목 · 섹션 제목         | 16px → 36px       |
  | 부제·날짜                | 10px → 18px       |
  | 카드 제목 / 내용          | 12px → 24px / 12px → 20px |
  | 주제 카드 몸통 / 프로그램 | 96px → 208px / 96px → 240px |
  | 일시·장소·신청 / 문의     | 12px → 20px       |
*/

/** ISO 일시 → 2026년 2월 8일 (일) 오전 10:00 (한국 시간) */
const formatSession = (iso: string) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
      .formatToParts(new Date(iso))
      .map((part) => [part.type, part.value]),
  );
  return `${p.year}년 ${p.month}월 ${p.day}일 (${p.weekday}) ${p.dayPeriod} ${p.hour}:${p.minute}`;
};

/** 주제·프로그램 카드 안의 짧은 설명 (굵게 + 줄바꿈) */
const cardTextComponents: PortableTextComponents = {
  block: { normal: ({ children }) => <p>{children}</p> },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
  },
};

/** 공통 레이아웃: 좌우 여백 37px → 231px (1920px에서 내용 폭 1458px) */
const SECTION_CLASS =
  'mx-auto w-full max-w-[1920px] px-[clamp(37px,12.63vw_-_11.5px,231px)] pb-[clamp(56px,7vw,137px)]';

/** 섹션 제목: 모바일 가운데 · 데스크탑 왼쪽 */
const SECTION_TITLE_CLASS =
  'text-center text-[clamp(16px,11px_+_1.3vw,36px)] font-semibold text-zinc-800 lg:text-left lg:text-neutral-800';

/** 주제 카드: 모바일 1열 → 데스크탑 2열 */
const THEMES_GRID_CLASS =
  'mt-[clamp(46px,33.25px_+_3.320vw,97px)] grid grid-cols-1 gap-x-[clamp(36px,20.50px_+_4.036vw,98px)] gap-y-[clamp(36px,34px_+_0.521vw,44px)] lg:grid-cols-2';

/** 프로그램 카드: 모바일 1열 → 데스크탑 3열 */
const STEPS_GRID_CLASS =
  'mt-[clamp(46px,29.50px_+_4.297vw,112px)] grid grid-cols-1 gap-[clamp(36px,34px_+_0.521vw,44px)] lg:grid-cols-3';

/** 일시·장소·신청 + 문의: 카드보다 안쪽 (1920px에서 내용 폭 1000px) */
const INFO_INSET = 'px-[clamp(12px,14.13vw_-_42.25px,229px)]';

/** 회색 머리 + 흰 몸통 카드 */
const InfoCard = ({
  title,
  description,
  bodyMinH,
}: {
  title: string;
  description?: OpenhouseBlockItem['description'];
  /** 몸통 최소 높이 (Tailwind 클래스) */
  bodyMinH: string;
}) => (
  <li className="flex flex-col overflow-hidden rounded-[10px] bg-zinc-400/50">
    {/* 머리: 24px → 64px */}
    <p className="flex h-[clamp(24px,14px_+_2.6vw,64px)] shrink-0 items-center justify-center px-[0.6em] text-center text-[clamp(12px,9px_+_0.78vw,24px)] font-semibold text-zinc-800">
      {title}
    </p>
    {/* 몸통 */}
    <div
      className={`flex flex-1 items-center justify-center bg-neutral-50 px-[1.2em] py-[0.8em] text-center text-[clamp(12px,10px_+_0.52vw,20px)] leading-[clamp(16px,11px_+_1.04vw,32px)] break-keep text-neutral-700 ${bodyMinH}`}
    >
      {description && description.length > 0 && (
        <div>
          <PortableText value={description} components={cardTextComponents} />
        </div>
      )}
    </div>
  </li>
);

const OpenhouseDetail = () => {
  const params = useParams<{ urlTitle: string }>();
  const urlTitle = params?.urlTitle ? decodeURIComponent(params.urlTitle) : '';

  const [post, setPost] = useState<OpenhouseDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 주소에서 값을 못 읽어도 로딩이 끝나도록
    if (!urlTitle) {
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setPost(await getOpenhouseDetailData(urlTitle));
      } catch (error) {
        console.error('오픈하우스 상세 데이터를 불러오지 못했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [urlTitle]);

  if (loading) return <OpenhouseDetailSkeleton />;

  if (!post) {
    return (
      <div className="w-full py-[clamp(80px,10vw,144px)] text-center text-[clamp(13px,11px_+_0.52vw,18px)] text-neutral-400">
        해당 게시물을 찾을 수 없습니다.
      </div>
    );
  }

  const sessions = post.sessions ?? [];
  const themes = post.themes ?? [];
  const steps = post.steps ?? [];

  return (
    <article className={SECTION_CLASS}>
      {/* 머리말: 모바일 [제목 / 부제 / 날짜] 가운데 · 데스크탑 왼쪽 [제목 / 부제] + 오른쪽 날짜 */}
      <header className="mx-auto flex max-w-64 flex-col items-center text-center lg:max-w-none lg:flex-row lg:items-start lg:justify-between lg:gap-[clamp(16px,2vw,40px)] lg:text-left">
        <div className="flex flex-col items-center lg:items-start">
          <h1 className="leading-1.4 mb-[clamp(14px,12.75px_+_0.326vw,19px)] text-[clamp(16px,11px_+_1.3vw,36px)] font-semibold whitespace-pre-line text-neutral-600 lg:leading-none lg:text-neutral-800">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="leading-2.8 lg:leading-1.2 text-[clamp(10px,8px_+_0.52vw,18px)] text-neutral-500 lg:text-zinc-800">
              {post.subtitle}
            </p>
          )}
        </div>
        <p className="leading-2.8 lg:leading-1.2 shrink-0 text-[clamp(10px,8px_+_0.52vw,18px)] text-neutral-500 lg:text-zinc-500">
          {post.dateRange}
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

      {/* 오픈하우스 주제 */}
      {themes.length > 0 && (
        <section className="mt-[clamp(57px,0.25px_+_14.779vw,284px)]">
          <h2 className={SECTION_TITLE_CLASS}>오픈하우스 주제</h2>
          <ul className={THEMES_GRID_CLASS}>
            {themes.map((theme) => (
              <InfoCard
                key={theme._key}
                title={theme.title}
                description={theme.description}
                bodyMinH="min-h-[clamp(96px,68px_+_7.292vw,208px)]"
              />
            ))}
          </ul>
        </section>
      )}

      {/* 오픈하우스 프로그램 (01, 02… 자동 번호) */}
      {steps.length > 0 && (
        <section
          className={
            themes.length > 0
              ? 'mt-[clamp(79px,34.50px_+_11.589vw,257px)]'
              : 'mt-[clamp(57px,0.25px_+_14.779vw,284px)]'
          }
        >
          <h2 className={SECTION_TITLE_CLASS}>오픈하우스 프로그램</h2>
          <ol className={STEPS_GRID_CLASS}>
            {steps.map((step, i) => (
              <InfoCard
                key={step._key}
                title={`${String(i + 1).padStart(2, '0')} ${step.title}`}
                description={step.description}
                bodyMinH="min-h-[clamp(96px,60px_+_9.375vw,240px)]"
              />
            ))}
          </ol>
        </section>
      )}

      {/* 일시·장소·신청 + 문의: 카드보다 안쪽, 글은 왼쪽 정렬 */}
      <div
        className={`mt-[clamp(118px,111px_+_1.823vw,146px)] flex w-full flex-col items-start gap-[clamp(64px,40px_+_6.25vw,160px)] text-left ${INFO_INSET}`}
      >
        <dl className="leading-1.6 flex flex-col gap-[clamp(10px,5.5px_+_1.172vw,28px)] text-[clamp(12px,10px_+_0.52vw,20px)]">
          {/* 일시: 회차마다 한 줄 (1차, 2차…) */}
          <div className="flex">
            <dt className="w-[clamp(36px,25px_+_2.87vw,80px)] shrink-0 font-medium text-zinc-800 lg:font-semibold">
              일시
            </dt>
            <dd className="min-w-0 text-neutral-600">
              {sessions.length > 0 ? (
                <ul className="grid grid-cols-[auto_1fr] gap-x-[0.8em]">
                  {sessions.map((session, i) => (
                    <li key={session._key} className="contents">
                      <span>{i + 1}차</span>
                      <span>{formatSession(session.startAt)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                '-'
              )}
            </dd>
          </div>

          {post.place && (
            <div className="flex">
              <dt className="w-[clamp(36px,25px_+_2.87vw,80px)] shrink-0 font-medium text-zinc-800 lg:font-semibold">
                장소
              </dt>
              <dd className="min-w-0 text-neutral-600">{post.place}</dd>
            </div>
          )}

          {post.apply && (
            <div className="flex">
              <dt className="w-[clamp(36px,25px_+_2.87vw,80px)] shrink-0 font-medium text-zinc-800 lg:font-semibold">
                신청
              </dt>
              {/* Studio에서 Enter로 바꾼 줄 그대로 */}
              <dd className="min-w-0 whitespace-pre-line text-neutral-600">
                {post.apply}
              </dd>
            </div>
          )}
        </dl>

        {/* 신청 및 문의 (모든 게시물 공통) */}
        <address className="text-[clamp(12px,10px_+_0.52vw,20px)] leading-[clamp(16px,11px_+_1.302vw,36px)] text-neutral-700 not-italic">
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
const OpenhouseDetailSkeleton = () => (
  <article aria-busy className={`${SECTION_CLASS} animate-pulse`}>
    {/* 머리말 */}
    <div className="mx-auto flex max-w-64 flex-col items-center gap-[clamp(14px,12.75px_+_0.326vw,19px)] lg:max-w-none lg:flex-row lg:items-start lg:justify-between">
      <div className="flex flex-col items-center gap-[clamp(14px,12.75px_+_0.326vw,19px)] lg:items-start">
        <div className="h-[clamp(22px,11px_+_1.3vw,36px)] w-[clamp(180px,30vw,581px)] bg-neutral-200" />
        <div className="h-[clamp(12px,8px_+_0.52vw,18px)] w-[clamp(80px,7vw,128px)] bg-neutral-200" />
      </div>
      <div className="h-[clamp(12px,8px_+_0.52vw,18px)] w-[clamp(60px,5vw,96px)] bg-neutral-200" />
    </div>

    {/* 포스터 */}
    <div className="mx-auto mt-[clamp(40px,10px_+_7.75vw,159px)] aspect-square w-full max-w-209 bg-neutral-200" />

    {/* 오픈하우스 주제 */}
    <div className="mx-auto mt-[clamp(57px,0.25px_+_14.779vw,284px)] h-[clamp(16px,11px_+_1.3vw,36px)] w-[clamp(110px,14vw,260px)] bg-neutral-200 lg:mx-0" />
    <div className={THEMES_GRID_CLASS}>
      {Array.from({ length: 2 }, (_, i) => (
        <div
          key={i}
          className="h-[clamp(120px,82px_+_9.9vw,272px)] rounded-[10px] bg-neutral-200"
        />
      ))}
    </div>

    {/* 오픈하우스 프로그램 */}
    <div className="mx-auto mt-[clamp(79px,34.50px_+_11.589vw,257px)] h-[clamp(16px,11px_+_1.3vw,36px)] w-[clamp(130px,17vw,320px)] bg-neutral-200 lg:mx-0" />
    <div className={STEPS_GRID_CLASS}>
      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={i}
          className="h-[clamp(120px,74px_+_11.98vw,304px)] rounded-[10px] bg-neutral-200"
        />
      ))}
    </div>

    {/* 일시·장소·신청 */}
    <div
      className={`mt-[clamp(118px,111px_+_1.823vw,146px)] flex w-full flex-col gap-[clamp(10px,5.5px_+_1.172vw,28px)] ${INFO_INSET}`}
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

export default OpenhouseDetail;
