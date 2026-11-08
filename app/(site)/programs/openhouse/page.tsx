import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProgramDetailList from '@/components/programs/ProgramDetailList';

const PROGRAM_PAGES = {
  workshop: { title: ['몸건축 워크샵', '원주 오픈하우스'] },
  newProject: { title: ['신규 프로젝트', '오픈하우스'] },
  consulting: { title: ['찾아가는', '건축상담'] },
} as const satisfies Record<string, { title: [string, string] }>;

type ProgramKey = keyof typeof PROGRAM_PAGES;

const isProgramKey = (value: string): value is ProgramKey =>
  Object.hasOwn(PROGRAM_PAGES, value);

type Props = {
  params: Promise<{ detail: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PROGRAM_PAGES).map((detail) => ({ detail }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { detail } = await params;
  if (!isProgramKey(detail)) return {};
  return { title: PROGRAM_PAGES[detail].title.join(' ') };
}

const Page = async ({ params, searchParams }: Props) => {
  const { detail } = await params;
  if (!isProgramKey(detail)) notFound();

  const sp = await searchParams;
  const year =
    typeof sp.year === 'string' && /^\d{4}$/.test(sp.year) ? sp.year : '';
  const page = Math.max(1, Math.floor(Number(sp.page)) || 1);

  return (
    <ProgramDetailList
      program={detail}
      basePath={`/program/${detail}`}
      title={PROGRAM_PAGES[detail].title}
      year={year}
      page={page}
    />
  );
};

export default Page;
