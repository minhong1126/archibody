/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PortableTextBlock } from 'next-sanity';
import { client } from '@/sanity/lib/client';

/** 목록 카드 */
export type WorkshopCard = {
  _id: string;
  title: string;
  urlTitle: string;
  /** 한국 시간 기준 날짜 (YYYY-MM-DD) — 카드 표시·연도 탭용 */
  date: string;
  subtitle?: string;
  thumbnail: any;
};

export type WorkshopListResult = {
  items: WorkshopCard[];
  total: number;
  /** 연도 탭을 만들기 위한 모든 날짜 (한국 시간 기준 YYYY-MM-DD) */
  dates: string[];
};

/** 상세 페이지 */
export type WorkshopDetail = WorkshopCard & {
  /** 시작 일시 (ISO) */
  startAt: string;
  /** 종료 일시 (ISO, 없을 수 있음) */
  endAt?: string;
  steps?: { _key: string; title: string; description?: string }[];
  place?: string;
  capacity?: string;
  fee?: string;
  body?: PortableTextBlock[];
};

/** Sanity datetime(UTC) → 한국 시간 날짜 YYYY-MM-DD */
const toKstDate = (iso?: string) =>
  iso
    ? new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(iso))
    : '';

/** 한국 시간 기준 그 해 1월 1일 0시 → UTC ISO */
const kstYearStart = (year: number) =>
  new Date(`${year}-01-01T00:00:00+09:00`).toISOString();

/**
  시작 일시 (이전 'date' 필드로 입력한 게시물도 함께 읽음)
  예전 게시물을 모두 새 형식으로 다시 입력하면 coalesce 부분은 지워도 됨
*/
const START = `coalesce(startAt, date + "T00:00:00+09:00")`;

// ───────── 목록 ─────────
const LIST_FILTER = `_type == "workshopPost" && ($from == "" || (dateTime(${START}) >= dateTime($from) && dateTime(${START}) < dateTime($to)))`;

const WORKSHOP_LIST_QUERY = `{
  "items": *[${LIST_FILTER}] | order(dateTime(${START}) desc) [$start...$end] {
    _id, title, "urlTitle": urlTitle.current, "startAt": ${START}, subtitle, thumbnail
  },
  "total": count(*[${LIST_FILTER}]),
  "dates": *[_type == "workshopPost" && defined(${START})]{ "d": ${START} }.d
}`;

type RawListResult = {
  items: (Omit<WorkshopCard, 'date'> & { startAt: string })[];
  total: number;
  dates: string[];
};

export const getWorkshopList = async ({
  year = '',
  page = 1,
  pageSize = 12,
}: {
  year?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<WorkshopListResult> => {
  const start = (page - 1) * pageSize;

  const data = await client.fetch<RawListResult | null>(WORKSHOP_LIST_QUERY, {
    from: year ? kstYearStart(Number(year)) : '',
    to: year ? kstYearStart(Number(year) + 1) : '',
    start,
    end: start + pageSize,
  });

  if (!data) return { items: [], total: 0, dates: [] };

  return {
    items: data.items.map(({ startAt, ...item }) => ({
      ...item,
      date: toKstDate(startAt),
    })),
    total: data.total,
    dates: data.dates.map(toKstDate).filter(Boolean),
  };
};

// ───────── 상세 ─────────
const WORKSHOP_DETAIL_QUERY = `*[_type == "workshopPost" && urlTitle.current == $urlTitle][0] {
  _id, title, "urlTitle": urlTitle.current, subtitle, thumbnail,
  "startAt": ${START},
  endAt,
  steps[] { _key, title, description },
  place, capacity, fee,
  body
}`;

export const getWorkshopDetail = async (
  urlTitle: string,
): Promise<WorkshopDetail | null> => {
  const data = await client.fetch<Omit<WorkshopDetail, 'date'> | null>(
    WORKSHOP_DETAIL_QUERY,
    { urlTitle },
  );
  return data ? { ...data, date: toKstDate(data.startAt) } : null;
};
