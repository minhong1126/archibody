// sanity/schemaTypes/project.ts
import { defineField, defineType } from 'sanity';

export const projectSchema = defineType({
  name: 'project',
  title: '프로젝트',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'urlTitle',
      title: '페이지 이름',
      description:
        '주소의 /projects/ 뒤에 들어가는 영문 이름입니다. (예: dajeonghan-jib)',
      type: 'slug',
      options: { maxLength: 96 }, // source를 빼면 Generate 버튼이 사라짐
      validation: (Rule) =>
        Rule.required().custom((slug) =>
          !slug?.current || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug.current)
            ? true
            : '영문 소문자, 숫자, 하이픈(-)만 사용할 수 있어요. (예: dajeonghan-jib)',
        ),
    }),
    defineField({
      name: 'region',
      title: '지역',
      type: 'string',
      description: '목록 페이지 필터 탭에 사용됩니다',
      options: {
        list: [
          { title: '경기', value: '경기' },
          { title: '강원', value: '강원' },
          { title: '충남/충북', value: '충남/충북' },
          { title: '전남/전북', value: '전남/전북' },
          { title: '기타', value: '기타' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: '위치',
      type: 'string',
      description: '예: 원주시 산현리',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'completionDate',
      title: '준공일',
      type: 'string',
      description: '연도와 월만 입력해 주세요. (예: 2026.04)',
      placeholder: '2026.04',
      validation: (Rule) =>
        Rule.required()
          .regex(/^\d{4}\.(0[1-9]|1[0-2])$/, {
            name: 'YYYY.MM',
            invert: false,
          })
          .error('2026.04 형식으로 입력해 주세요.'),
    }),

    defineField({
      name: 'scale',
      title: '규모',
      type: 'string',
      description: '예: 지상 2층',
    }),
    defineField({
      name: 'occupants',
      title: '거주인원',
      type: 'string',
      description: '예: 2인 2묘',
    }),
    defineField({
      name: 'siteArea',
      title: '대지면적 (㎡)',
      type: 'number',
    }),
    defineField({
      name: 'buildingArea',
      title: '건축면적 (㎡)',
      type: 'number',
    }),
    defineField({
      name: 'totalFloorArea',
      title: '연면적 (㎡)',
      type: 'number',
    }),
    defineField({
      name: 'thumbnail',
      title: '썸네일 이미지',
      type: 'image',
      description: '목록 페이지 카드에 사용됩니다',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: '갤러리 이미지',
      type: 'array',
      description: '상세 페이지에 순서대로 노출됩니다',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'thumbnail',
    },
  },
});
