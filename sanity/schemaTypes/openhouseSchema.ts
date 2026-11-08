// sanity/schemaTypes/openHouse.ts
import { defineArrayMember, defineField, defineType } from 'sanity';

/** 굵게만 가능한 짧은 설명 (주제·프로그램 카드 안의 글) */
const shortRichText = (description: string) =>
  defineField({
    name: 'description',
    title: '내용',
    description,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
        styles: [{ title: '기본', value: 'normal' }],
        lists: [],
        marks: {
          decorators: [{ title: '굵게', value: 'strong' }],
          annotations: [],
        },
      }),
    ],
  });

const kstDateTime = (iso?: string) =>
  iso
    ? new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(iso))
    : '';

export const openhouseSchema = defineType({
  name: 'openHouse',
  title: '오픈하우스',
  type: 'document',
  fields: [
    // ───────── 기본 정보 (목록 카드 + 상세 상단) ─────────
    defineField({
      name: 'title',
      title: '제목',
      description:
        '형식: 한 줄 텍스트 (연도 + 지역 + 오픈하우스) · 예: 2026 원주 호저면 오픈하우스',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'urlTitle',
      title: '페이지 이름',
      description:
        '상세 페이지 주소에 쓰입니다. 형식: 영문 소문자·숫자·하이픈(-)만, 공백·한글 불가 · 예: 2026-wonju-hojeo',
      type: 'slug',
      options: { maxLength: 96 },
      validation: (Rule) =>
        Rule.required().custom((slug) =>
          !slug?.current || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug.current)
            ? true
            : '영문 소문자, 숫자, 하이픈(-)만 사용할 수 있어요.',
        ),
    }),
    defineField({
      name: 'subtitle',
      title: '부제',
      description: '형식: 짧은 한 줄 텍스트 · 예: 신축 오픈하우스',
      type: 'string',
    }),
    defineField({
      name: 'thumbnail',
      title: '포스터 이미지',
      description:
        '목록 카드와 상세 페이지 상단에 사용됩니다. 형식: JPG·PNG·WEBP, 정사각형(1:1) 1200×1200px 이상 권장',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: '대체 텍스트', type: 'string' }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ───────── 일시 (회차) ─────────
    defineField({
      name: 'sessions',
      title: '일시 (회차)',
      description:
        '형식: 회차별 날짜·시간 (최소 1개). 회차 순서대로 추가하면 1차, 2차… 이름이 자동으로 붙고, 목록의 날짜(예: 2025.10.19-10.20)와 연도 필터도 여기서 만들어집니다.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'session',
          fields: [
            defineField({
              name: 'startAt',
              title: '시작 일시',
              description:
                '형식: YYYY.MM.DD HH:mm (30분 단위) · 예: 2026.02.08 10:00',
              type: 'datetime',
              options: {
                dateFormat: 'YYYY.MM.DD',
                timeFormat: 'HH:mm',
                timeStep: 30,
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { startAt: 'startAt', endAt: 'endAt' },
            prepare: ({ startAt, endAt }) => ({
              title: kstDateTime(startAt),
              subtitle: endAt ? `~ ${kstDateTime(endAt)}` : undefined,
            }),
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    // ───────── 오픈하우스 주제 ─────────
    defineField({
      name: 'themes',
      title: '오픈하우스 주제',
      description:
        '형식: 주제 이름 + 설명을 한 묶음으로 추가 · 예: SIP 고단열 주택 / 책을 담은 집 & 무장애 공간',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'theme',
          fields: [
            defineField({
              name: 'title',
              title: '주제',
              description: '형식: 짧은 한 줄 텍스트 · 예: SIP 고단열 주택',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            shortRichText(
              '형식: 2~4줄 정도의 설명, 강조할 부분은 선택 후 B(굵게), Shift + Enter로 줄바꿈 · 예: 몸건축이 늘 강조해온 기후변화에 대비한 집(← 굵게)입니다.',
            ),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),

    // ───────── 오픈하우스 프로그램 ─────────
    defineField({
      name: 'steps',
      title: '오픈하우스 프로그램',
      description:
        '형식: 프로그램 이름 + 설명을 순서대로 추가. 01, 02… 번호는 자동으로 붙습니다. · 예: 집 둘러보기 / 집 이야기 / Q&A',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          fields: [
            defineField({
              name: 'title',
              title: '프로그램 이름',
              description:
                '형식: 짧은 한 줄 텍스트, 번호 없이 · 예: 집 둘러보기',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            shortRichText(
              '형식: 2~4줄 정도의 설명, 강조할 부분은 선택 후 B(굵게), Shift + Enter로 줄바꿈 · 예: 새로운 집을 둘러보며 고단열 SIP 공법(← 굵게)이 어떻게 적용되었는지 확인합니다.',
            ),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),

    // ───────── 장소 · 신청 ─────────
    defineField({
      name: 'place',
      title: '장소',
      description:
        '형식: 한 줄 텍스트 (주소 + 필요하면 괄호로 안내) · 예: 강원도 원주시 호저면 (상세 주소는 신청 시 공지)',
      type: 'string',
    }),
    defineField({
      name: 'apply',
      title: '신청 방법',
      description:
        '형식: 여러 줄 텍스트, Enter로 줄바꿈 · 예: 문자 또는 메일 신청 ⏎ 오픈하우스 해당 회차 / 성함 / 연락처 / 참석 인원',
      type: 'text',
      rows: 3,
    }),
  ],
  orderings: [
    {
      title: '날짜 최신순',
      name: 'firstSessionDesc',
      by: [{ field: 'sessions.0.startAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      startAt: 'sessions.0.startAt',
      media: 'thumbnail',
    },
    prepare: ({ title, subtitle, startAt, media }) => ({
      title,
      subtitle: [kstDateTime(startAt), subtitle].filter(Boolean).join(' · '),
      media,
    }),
  },
});
