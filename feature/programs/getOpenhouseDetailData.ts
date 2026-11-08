/* eslint-disable @typescript-eslint/no-explicit-any */
// feature/programs/getOpenhouseDetailData.ts
// 오픈하우스 상세 (urlTitle로 게시물 하나)

import type { PortableTextBlock } from 'next-sanity';
import { client } from '@/sanity/lib/client';

/** 주제 · 프로그램 카드 */
export type OpenhouseBlockItem = {
  _key: string;
  title: string;
  description?: PortableTextBlock[];
};

export type OpenhouseDetail = {
  _id: string;
  title: string;
  urlTitle: string;
  /** 첫 회차의 한국 시간 날짜 (YYYY-MM-DD) */
  date: string;
  /** 첫 회차 ~ 마지막 회차 (예: 2025.10.19-10.20) */
  dateRange: string;
  subtitle?: string;
  thumbnail: any;
  /** 회차 (순서대로 1차, 2차…) */
  sessions: { _key: string; startAt: string }[];
  /** 오픈하우스 주제 */
  themes?: OpenhouseBlockItem[];
  /** 오픈하우스 프로그램 (순서대로 01, 02…) */
  steps?: OpenhouseBlockItem[];
  place?: string;
  /** 신청 방법 (여러 줄 텍스트) */
  apply?: string;
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

/** 첫 회차 ~ 마지막 회차 날짜 (같은 날 / 같은 해 / 해가 다름) */
const toDateRange = (firstIso?: string, lastIso?: string) => {
  const first = toKstDate(firstIso);
  const last = toKstDate(lastIso);
  if (!first) return '';
  const firstDot = first.replaceAll('-', '.');
  if (!last || last === first) return firstDot;
  return last.slice(0, 4) === first.slice(0, 4)
    ? `${firstDot}-${last.slice(5).replace('-', '.')}`
    : `${firstDot}-${last.replaceAll('-', '.')}`;
};

const OPENHOUSE_DETAIL_QUERY = `*[_type == "openHouse" && urlTitle.current == $urlTitle][0] {
  _id,
  title,
  "urlTitle": urlTitle.current,
  subtitle,
  thumbnail,
  sessions[] { _key, startAt },
  themes[] { _key, title, description },
  steps[] { _key, title, description },
  place,
  apply
}`;

export const getOpenhouseDetailData = async (
  urlTitle: string,
): Promise<OpenhouseDetail | null> => {
  const data = await client.fetch<Omit<
    OpenhouseDetail,
    'date' | 'dateRange'
  > | null>(OPENHOUSE_DETAIL_QUERY, { urlTitle });
  if (!data) return null;

  const sessions = data.sessions ?? [];
  const firstAt = sessions[0]?.startAt;
  const lastAt = sessions.at(-1)?.startAt;

  return {
    ...data,
    sessions,
    date: toKstDate(firstAt),
    dateRange: toDateRange(firstAt, lastAt),
  };
};
