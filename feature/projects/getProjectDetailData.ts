import { client } from '@/sanity/lib/client';

export type SanityProjectDetail = {
  _id: string;
  title: string;
  region: string;
  completionDate: string;
  location: string;
  scale?: string;
  occupants?: string;
  siteArea?: string | number;
  buildingArea?: string | number;
  totalFloorArea?: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thumbnail: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gallery?: any[];
};

const PROJECT_DETAIL_QUERY = `*[_type == "project" && urlTitle.current == $urlTitle][0] {
  _id, title, region, completionDate, location, scale, occupants,
  siteArea, buildingArea, totalFloorArea, thumbnail, gallery
}`;

export const getProjectDetailData = (urlTitle: string) =>
  client.fetch<SanityProjectDetail | null>(PROJECT_DETAIL_QUERY, { urlTitle });
