import { groq } from 'next-sanity';

export const PROJECTS_QUERY = groq`
  *[_type == "project"] | order(completionDate desc) {
    _id,
    title,
    "urlTitle": urlTitle.current,
    region,
    location,
    completionDate,
    thumbnail
  }
`;
