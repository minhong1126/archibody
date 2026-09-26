/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

type SanityProjectDetail = {
  _id: string;
  title: string;
  region: string;
  completionDate: string;
  location: string;
  scale?: string;
  occupants?: string;
  landArea?: string;
  buildingArea?: string;
  totalFloorArea?: string;
  mainImage: any;
  gallery?: any[];
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const ProjectDetail = () => {
  const params = useParams();
  const urlTitle = params?.urlTitle as string;

  const [project, setProject] = useState<SanityProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!urlTitle) return;

    const fetchSingleProject = async () => {
      try {
        const query = `*[_type == "project" && urlTitle.current == $urlTitle][0] {
          _id,
          title,
          region,
          completionDate,
          location,
          scale,
          occupants,
          landArea,
          buildingArea,
          totalFloorArea,
          mainImage,
          gallery
        }`;

        const data = await client.fetch<SanityProjectDetail>(query, {
          urlTitle,
        });
        setProject(data);
      } catch (error) {
        console.error('프로젝트 상세 데이터를 불러오지 못했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleProject();
  }, [urlTitle]);

  // 데이터 로딩 중 스켈레톤 UI (animate-pulse 적용)
  if (loading) {
    return (
      <article className="size-full animate-pulse">
        <div className="mx-auto flex w-full flex-col gap-8 lg:flex-row lg:gap-16">
          <div className="flex w-full flex-col gap-6 lg:w-105 lg:shrink-0">
            <div className="order-1 h-8 w-3/4 bg-neutral-200 lg:order-2 lg:h-10" />
            <div className="order-2 h-4 w-1/2 bg-neutral-200 lg:order-1" />
            <div className="order-3 flex flex-col gap-3 pt-4">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 pb-3"
                >
                  <div className="h-4 w-16 bg-neutral-200" />
                  <div className="h-4 w-28 bg-neutral-200" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-2.5 lg:gap-3">
            <div className="relative aspect-[390/233] w-full bg-neutral-200 lg:aspect-[1075/644]" />
            <div className="flex flex-col gap-2.5 lg:flex-row lg:gap-3">
              <div className="relative aspect-[390/233] w-full bg-neutral-200 lg:aspect-[259/196] lg:w-64" />
              <div className="relative aspect-[390/233] w-full bg-neutral-200 lg:aspect-[259/196] lg:w-64" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (!project) {
    return (
      <div className="w-full py-36 text-center text-neutral-400">
        해당 프로젝트를 찾을 수 없습니다.
      </div>
    );
  }

  const specItems = [
    { label: '준공일', value: formatDate(project.completionDate) },
    { label: '위치', value: project.location },
    { label: '규모', value: project.scale || '-' },
    { label: '거주인원', value: project.occupants || '-' },
    { label: '대지면적', value: project.landArea || '-' },
    { label: '건축면적', value: project.buildingArea || '-' },
    { label: '연면적', value: project.totalFloorArea || '-' },
  ];

  return (
    <article className="size-full">
      <div className="mx-auto flex w-full flex-col gap-8 lg:flex-row lg:gap-16">
        <div className="flex w-full flex-col gap-6 lg:w-105 lg:shrink-0">
          <h1 className="order-1 text-center text-base font-semibold text-zinc-800 lg:order-2 lg:text-left lg:text-4xl lg:font-medium lg:text-zinc-600">
            {project.title}
          </h1>

          <nav className="order-2 flex items-center justify-center gap-4 text-xs text-zinc-400 lg:order-1 lg:justify-start lg:text-lg">
            <span className="hover:text-zinc-600">프로젝트</span>
            <span>{project.region}</span>
            <span>{project.title}</span>
          </nav>

          <dl className="order-3 flex flex-col gap-3">
            {specItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-none"
              >
                <dt className="text-[9px] text-neutral-400 lg:text-sm">
                  {item.label}
                </dt>
                <dd className="text-[9px] text-neutral-500 lg:text-sm">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex w-full flex-col gap-2.5 lg:gap-3">
          <div className="relative aspect-[390/233] w-full overflow-hidden lg:aspect-[1075/644]">
            {project.mainImage ? (
              <img
                src={urlFor(project.mainImage).width(1200).url()}
                alt={project.title}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 size-full bg-neutral-200" />
            )}
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div className="flex flex-col gap-2.5 lg:flex-row lg:gap-3">
              {project.gallery.map((imgObj, index) => (
                <div
                  key={index}
                  className="relative aspect-[390/233] w-full overflow-hidden lg:aspect-[259/196] lg:w-64"
                >
                  <img
                    src={urlFor(imgObj).width(500).url()}
                    alt={`${project.title} 갤러리 이미지 ${index + 1}`}
                    className="absolute inset-0 size-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectDetail;
