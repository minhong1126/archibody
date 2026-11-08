/* eslint-disable @typescript-eslint/no-explicit-any */
// feature/programs/getWorkshopDetailData.ts
// 워크샵 상세 (urlTitle로 게시물 하나)

import type { PortableTextBlock } from 'next-sanity';
import { client } from '@/sanity/lib/client';

export type WorkshopDetail = {
  _id: string;
  title: string;
  urlTitle: string;
  /** 한국 시간 기준 날짜 (YYYY-MM-DD) */
  date: string;
  subtitle?: string;
  thumbnail: any;
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

/** 시작 일시 (예전 'date' 필드로 입력한 게시물도 함께 읽음) */
const START = `coalesce(startAt, date + "T00:00:00+09:00")`;

const WORKSHOP_DETAIL_QUERY = `*[_type == "workshopPost" && urlTitle.current == $urlTitle][0] {
  _id,
  title,
  "urlTitle": urlTitle.current,
  subtitle,
  thumbnail,
  "startAt": ${START},
  endAt,
  steps[] { _key, title, description },
  place,
  capacity,
  fee,
  body
}`;

export const getWorkshopDetailData = async (
  urlTitle: string,
): Promise<WorkshopDetail | null> => {
  const data = await client.fetch<Omit<WorkshopDetail, 'date'> | null>(
    WORKSHOP_DETAIL_QUERY,
    { urlTitle },
  );
  return data ? { ...data, date: toKstDate(data.startAt) } : null;
};
