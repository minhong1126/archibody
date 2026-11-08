// sanity/schemaTypes/workshopPost.ts
// 몸건축 워크샵 · 원주 오픈하우스 (/programs/workshop)
import { defineArrayMember, defineField, defineType } from 'sanity';

export const workshopSchema = defineType({
  name: 'workshopPost',
  title: '워크샵',
  type: 'document',
  fields: [
    // ───────── 기본 정보 (목록 + 상세 상단) ─────────
    defineField({
      name: 'title',
      title: '제목',
      description:
        '예: 6월 오픈하우스 & 워크샵 (Enter로 줄바꿈하면 데스크탑 목록에서만 줄이 바뀝니다)',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'urlTitle',
      title: '페이지 이름',
      description:
        '상세 페이지 주소에 쓰이는 영문 이름입니다. (예: 2026-06-workshop)',
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
      name: 'startAt',
      title: '시작 일시',
      description:
        '행사 날짜와 시작 시간. 정렬·연도 필터·상세 페이지 일시에 사용됩니다.',
      type: 'datetime',
      options: { dateFormat: 'YYYY.MM.DD', timeFormat: 'HH:mm', timeStep: 30 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endAt',
      title: '종료 일시',
      description: '비워 두면 시작 시간만 표시됩니다.',
      type: 'datetime',
      options: { dateFormat: 'YYYY.MM.DD', timeFormat: 'HH:mm', timeStep: 30 },
      validation: (Rule) =>
        Rule.custom((endAt, context) => {
          const startAt = (context.document as { startAt?: string })?.startAt;
          if (!endAt || !startAt) return true;
          return new Date(endAt) > new Date(startAt)
            ? true
            : '종료 일시는 시작 일시보다 늦어야 해요.';
        }),
    }),
    defineField({
      name: 'subtitle',
      title: '부제',
      description: '예: 내 몸에 맞는 집짓기 A to Z',
      type: 'string',
    }),
    defineField({
      name: 'thumbnail',
      title: '포스터 이미지',
      description: '목록 카드와 상세 페이지 상단에 사용됩니다.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: '대체 텍스트', type: 'string' }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ───────── 행사 정보 (상세 페이지) ─────────
    defineField({
      name: 'steps',
      title: '프로그램 순서',
      description: '오프닝 → 체험 → 1부 강의 … 순서대로 입력합니다.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          fields: [
            defineField({
              name: 'title',
              title: '단계 이름',
              description: '예: 1부 강의',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: '내용',
              description: '예: 대표 및 소개 (Enter로 줄바꿈)',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        }),
      ],
    }),
    defineField({
      name: 'place',
      title: '장소',
      description: '예: 강원도 원주시 섭재삼보길 160-15',
      type: 'string',
    }),
    defineField({
      name: 'capacity',
      title: '인원',
      description: '예: 회당 10명 (선착순 접수)',
      type: 'string',
    }),
    defineField({
      name: 'fee',
      title: '참가비',
      description: '예: 없음',
      type: 'string',
    }),

    // ───────── 본문 (상세 페이지 하단 안내 문구) ─────────
    defineField({
      name: 'body',
      title: '본문',
      description:
        '안내 문구, 신청 방법 등. 글자를 선택하면 서식 도구가 나타납니다.',
      type: 'array',
      of: [
        // 글
        defineArrayMember({
          type: 'block',
          // 문단 스타일 (왼쪽 위 드롭다운)
          styles: [
            { title: '기본', value: 'normal' },
            { title: '제목 1', value: 'h2' },
            { title: '제목 2', value: 'h3' },
            { title: '인용', value: 'blockquote' },
          ],
          // 목록
          lists: [
            { title: '글머리 기호', value: 'bullet' },
            { title: '번호 목록', value: 'number' },
          ],
          marks: {
            // 글자 서식
            decorators: [
              { title: '굵게', value: 'strong' },
              { title: '기울임', value: 'em' },
              { title: '밑줄', value: 'underline' },
              { title: '취소선', value: 'strike-through' },
            ],
            // 링크
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: '링크',
                fields: [
                  defineField({
                    name: 'href',
                    title: '주소',
                    type: 'url',
                    description: 'https://, mailto:, tel: 로 시작하는 주소',
                    validation: (Rule) =>
                      Rule.required().uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),
                  defineField({
                    name: 'blank',
                    title: '새 탭에서 열기',
                    type: 'boolean',
                    initialValue: true,
                  }),
                ],
              },
            ],
          },
        }),
        // 본문 중간 이미지
        defineArrayMember({
          type: 'image',
          title: '이미지',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: '대체 텍스트', type: 'string' }),
            defineField({
              name: 'caption',
              title: '사진 설명',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: '날짜 최신순',
      name: 'startAtDesc',
      by: [{ field: 'startAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', startAt: 'startAt', media: 'thumbnail' },
    prepare: ({ title, startAt, media }) => ({
      title,
      subtitle: startAt
        ? new Intl.DateTimeFormat('ko-KR', {
            timeZone: 'Asia/Seoul',
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(startAt))
        : undefined,
      media,
    }),
  },
});
