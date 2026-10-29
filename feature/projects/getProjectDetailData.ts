import { client } from '@/sanity/lib/client';

export type SanityProjectDetail = {
  _id: string;
  title: string;
  region: string;
  completionDate: string;
  location: string;
  scale?: string;
  occupants?: string;
  landArea?: string | number;
  buildingArea?: string | number;
  totalFloorArea?: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mainImage: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gallery?: any[];
};

const PROJECT_DETAIL_QUERY = `*[_type == "project" && urlTitle.current == $urlTitle][0] {
  _id, title, region, completionDate, location, scale, occupants,
  landArea, buildingArea, totalFloorArea, mainImage, gallery
}`;

export const getProjectDetailData = (urlTitle: string) =>
  client.fetch<SanityProjectDetail | null>(PROJECT_DETAIL_QUERY, { urlTitle });
