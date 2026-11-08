/* eslint-disable @typescript-eslint/no-explicit-any */
// feature/programs/getOpenhouseMainList.ts
// 오픈하우스 전체 목록 (연도 필터·페이지 나누기는 화면에서 처리)

import { client } from '@/sanity/lib/client';

export type OpenhouseCard = {
  _id: string;
  title: string;
  urlTitle: string;
  /** 첫 회차의 한국 시간 날짜 (YYYY-MM-DD) — 정렬·연도 탭용 */
  date: string;
  /** 첫 회차 ~ 마지막 회차 (예: 2025.10.19-10.20, 하루면 2025.10.19) — 카드 표시용 */
  dateRange: string;
  subtitle?: string;
  thumbnail: any;
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

/**
  첫 회차 ~ 마지막 회차 날짜
  - 같은 날: 2026.02.08
  - 같은 해: 2025.10.19-10.20
  - 해가 다름: 2025.12.31-2026.01.01
*/
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

const OPENHOUSE_MAIN_LIST_QUERY = `*[_type == "openHouse" && defined(sessions[0].startAt)] | order(dateTime(sessions[0].startAt) desc) {
  _id,
  title,
  "urlTitle": urlTitle.current,
  subtitle,
  thumbnail,
  "firstAt": sessions[0].startAt,
  "lastAt": sessions[-1].startAt
}`;

type RawCard = Omit<OpenhouseCard, 'date' | 'dateRange'> & {
  firstAt: string;
  lastAt?: string;
};

/** 최신순 전체 목록 (첫 회차 기준) */
export const getOpenhouseMainList = async (): Promise<OpenhouseCard[]> => {
  const data = await client.fetch<RawCard[] | null>(OPENHOUSE_MAIN_LIST_QUERY);

  return (data ?? []).map(({ firstAt, lastAt, ...item }) => ({
    ...item,
    date: toKstDate(firstAt),
    dateRange: toDateRange(firstAt, lastAt),
  }));
};
