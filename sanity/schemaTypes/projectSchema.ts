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
        '주소의 /project/ 이후에 들어가는 단어입니다. 한글은 피해주세요',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
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
      type: 'date',
      options: {
        dateFormat: 'YYYY.MM',
      },
      validation: (Rule) => Rule.required(),
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
