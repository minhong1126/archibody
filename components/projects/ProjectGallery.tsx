/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
'use client';

import { type TouchEvent, useEffect, useRef, useState } from 'react';
import { urlFor } from '@/sanity/lib/image';

/** 큰 사진이 다음 사진으로 넘어가는 간격 (ms) */
const AUTOPLAY_INTERVAL = 4000;
/** 모달에서 이 거리(px) 이상 밀면 이전/다음 사진으로 */
const SWIPE_THRESHOLD = 50;

type Props = {
  images: any[];
  title: string;
};

const ProjectGallery = ({ images, title }: Props) => {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  /** 모바일 사진 확대 모달: 열린 사진 번호 (닫힘이면 null) */
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);

  const altOf = (index: number) => `${title} 사진 ${index + 1}`;

  // 큰 사진 자동 넘김 (사진을 고르면 그 시점부터 다시 계산)
  useEffect(() => {
    if (images.length < 2 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = setTimeout(() => {
      setSelected((prev) => (prev + 1) % images.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearTimeout(timer);
  }, [selected, paused, images.length]);

  // 선택된 썸네일이 목록 밖에 있으면 그 위치로 가로 스크롤 (페이지 전체는 움직이지 않음)
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[selected] as HTMLElement | undefined;
    if (!list || !item) return;

    const itemLeft = item.offsetLeft;
    const itemRight = itemLeft + item.offsetWidth;

    if (itemLeft < list.scrollLeft) {
      list.scrollTo({ left: itemLeft, behavior: 'smooth' });
    } else if (itemRight > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: itemRight - list.clientWidth, behavior: 'smooth' });
    }
  }, [selected]);

  // 모달 열기/닫기 + 열려 있는 동안 뒤 페이지 스크롤 막기
  const isViewerOpen = viewerIndex !== null;
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isViewerOpen && !dialog.open) dialog.showModal();
    if (!isViewerOpen && dialog.open) dialog.close();

    if (!isViewerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isViewerOpen]);

  const closeViewer = () => setViewerIndex(null);
  const showPrev = () =>
    setViewerIndex((i) =>
      i === null ? i : (i - 1 + images.length) % images.length,
    );
  const showNext = () =>
    setViewerIndex((i) => (i === null ? i : (i + 1) % images.length));

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) < SWIPE_THRESHOLD || images.length < 2) return;
    if (diff > 0) showPrev();
    else showNext();
  };

  return (
    <>
      {/* 모바일: 모든 사진을 세로로, 누르면 크게 보기 */}
      <ul className="flex flex-col gap-[clamp(8px,2.6vw,12px)] lg:hidden">
        {images.map((image, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setViewerIndex(i)}
              aria-label={`${altOf(i)} 크게 보기`}
              className="relative block aspect-[390/233] w-full overflow-hidden bg-neutral-100 active:opacity-80"
            >
              <img
                src={urlFor(image).width(800).auto('format').url()}
                alt={altOf(i)}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="absolute inset-0 size-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* 모바일 사진 확대 모달 */}
      <dialog
        ref={dialogRef}
        onClose={closeViewer}
        onClick={(e) => {
          // 사진 바깥(배경)을 누르면 닫기
          if (e.target === e.currentTarget) closeViewer();
        }}
        aria-label={`${title} 사진 크게 보기`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/90 lg:hidden"
      >
        {viewerIndex !== null && (
          <div
            className="relative flex size-full items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeViewer();
            }}
          >
            <img
              key={viewerIndex}
              src={urlFor(images[viewerIndex]).width(1600).auto('format').url()}
              alt={altOf(viewerIndex)}
              className="max-h-[80%] max-w-[92%] object-contain"
            />

            {/* 닫기 */}
            <button
              type="button"
              onClick={closeViewer}
              aria-label="닫기"
              className="absolute top-[max(12px,env(safe-area-inset-top))] right-3 grid size-11 place-items-center text-white/90"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="size-6 stroke-current"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {images.length > 1 && (
              <>
                {/* 이전 / 다음 */}
                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="이전 사진"
                  className="absolute top-1/2 left-1 grid size-11 -translate-y-1/2 place-items-center text-white/80"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="size-6 stroke-current"
                  >
                    <path
                      d="M15 5l-7 7 7 7"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="다음 사진"
                  className="absolute top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center text-white/80"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className="size-6 stroke-current"
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* 몇 번째 사진인지 */}
                <p className="absolute bottom-[max(16px,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-xs text-white/80">
                  {viewerIndex + 1} / {images.length}
                </p>
              </>
            )}
          </div>
        )}
      </dialog>

      {/*
        데스크탑: 시안(1075 × 854) 비율 그대로
        - 큰 사진 1075 × 644, 썸네일 259 × 196 4장, 간격 14 / 12
        - 갤러리 너비(--gw)는 [영역 너비]와 [영역 높이 × 1075/854] 중 작은 값 → 화면 안에 항상 꽉 맞게
      */}
      <div
        className="[container-type:size] hidden size-full lg:block"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="flex w-(--gw) flex-col gap-[calc(var(--gw)*14/1075)] [--gw:min(100cqw,calc(100cqh*1075/854))]">
          <div className="relative aspect-[1075/644] w-full overflow-hidden bg-neutral-100">
            {images.map((image, i) => (
              <img
                key={i}
                src={urlFor(image).width(1600).auto('format').url()}
                alt={i === selected ? altOf(i) : ''}
                aria-hidden={i !== selected}
                loading={i === 0 ? 'eager' : 'lazy'}
                className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
                  i === selected ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>

          {images.length > 1 && (
            <ul
              ref={listRef}
              className="relative flex gap-[calc(var(--gw)*12/1075)] overflow-x-auto"
            >
              {images.map((image, i) => (
                <li key={i} className="w-[calc(var(--gw)*259/1075)] shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-label={`${i + 1}번째 사진 크게 보기`}
                    aria-pressed={i === selected}
                    className={`relative block aspect-[259/196] w-full overflow-hidden bg-neutral-100 transition-opacity focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stone-400 ${
                      i === selected
                        ? 'opacity-100'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={urlFor(image).width(400).auto('format').url()}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectGallery;
