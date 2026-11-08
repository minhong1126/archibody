/* eslint-disable @typescript-eslint/no-explicit-any */
// feature/programs/getWorkshopMainList.ts
// 워크샵 전체 목록 (연도 필터·페이지 나누기는 화면에서 처리)

import { client } from '@/sanity/lib/client';

export type WorkshopCard = {
  _id: string;
  title: string;
  urlTitle: string;
  /** 한국 시간 기준 날짜 (YYYY-MM-DD) — 정렬·연도 탭·카드 날짜용 */
  date: string;
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

/** 시작 일시 (예전 'date' 필드로 입력한 게시물도 함께 읽음) */
const START = `coalesce(startAt, date + "T00:00:00+09:00")`;

const WORKSHOP_MAIN_LIST_QUERY = `*[_type == "workshopPost" && defined(${START})] | order(dateTime(${START}) desc) {
  _id,
  title,
  "urlTitle": urlTitle.current,
  subtitle,
  thumbnail,
  "startAt": ${START}
}`;

type RawCard = Omit<WorkshopCard, 'date'> & { startAt: string };

/** 최신순 전체 목록 */
export const getWorkshopMainList = async (): Promise<WorkshopCard[]> => {
  const data = await client.fetch<RawCard[] | null>(WORKSHOP_MAIN_LIST_QUERY);

  return (data ?? []).map(({ startAt, ...item }) => ({
    ...item,
    date: toKstDate(startAt),
  }));
};
