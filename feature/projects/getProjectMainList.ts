/* eslint-disable @typescript-eslint/no-explicit-any */
// feature/projects/getProjectMainList.ts
import { client } from '@/sanity/lib/client';

export type SanityProject = {
  _id: string;
  title: string;
  urlTitle: string;
  region: string;
  location: string;
  completionDate: string;
  thumbnail: any;
};

const PROJECT_MAIN_LIST_QUERY = `*[_type == "project"] | order(completionDate desc) {
  _id,
  title,
  "urlTitle": urlTitle.current,
  region,
  location,
  completionDate,
  thumbnail
}`;

export const getProjectMainList = async () =>
  client.fetch<SanityProject[]>(PROJECT_MAIN_LIST_QUERY);
