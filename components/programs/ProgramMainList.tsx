import { Fragment } from 'react';
import Link from 'next/link';
import getProgramDescList from '@/feature/programs/getProgramDescList';

const softShadow =
  'shadow-[0px_16px_28.5px_0px_rgba(0,0,0,0.05),inset_-5px_1px_19px_0px_rgba(255,255,255,1)]';

const ProgramMainList = () => {
  const programDescList = getProgramDescList();

  return (
    <section className="w-full px-[10%] py-20 lg:pt-24">
      <h2 className="section-title">건축주 참여 프로그램</h2>
      <ul className="mt-18 flex flex-col gap-5 lg:mt-20 lg:gap-17.5">
        {programDescList.map((program) => (
          <li key={program.index}>
            <Link
              href={program.href}
              aria-label={`${program.title} 자세히 보기`}
              className={[
                'group relative block break-keep transition',
                // 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-400',
                'rounded-[10px] bg-zinc-400/10 px-5 py-6 active:bg-zinc-400/20',
                'lg:flex lg:rounded-[40px] lg:bg-transparent lg:active:bg-transparent',
                'lg:px-12 lg:py-12',
              ].join(' ')}
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 hidden rounded-[40px] bg-linear-to-b from-stone-300/20 to-white/20 opacity-50 transition-opacity group-hover:opacity-100 lg:block ${softShadow}`}
              />

              <div className="relative flex items-center gap-3 lg:items-start lg:justify-end lg:gap-10">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full bg-linear-to-b ${program.accent} to-white/5 lg:size-16 ${softShadow}`}
                >
                  <span className="text-base font-bold text-zinc-500 lg:text-3xl">
                    {program.index}
                  </span>
                </span>
                <h3 className="leading-tight font-semibold break-keep text-neutral-700 lg:text-3xl lg:text-neutral-600">
                  {program.title[0]}
                  <br />
                  {program.title[1]}
                </h3>
              </div>

              <dl className="mt-5 grid grid-cols-[auto_1fr] items-start gap-2.5 lg:mt-0 lg:ml-10 lg:min-w-0 lg:flex-1 lg:gap-x-4 lg:gap-y-3">
                {program.rows.map((row) => (
                  <Fragment key={row.label}>
                    <dt className="mt-px flex h-3.5 w-7 items-center justify-center rounded-[5px] bg-stone-300/60 text-[8px] font-semibold text-zinc-600 lg:mt-0.5 lg:h-7 lg:w-12 lg:bg-stone-300 lg:text-base">
                      {row.label}
                    </dt>
                    <dd className="text-[10px] leading-4 font-medium text-stone-500 lg:text-lg lg:leading-8">
                      {row.value}
                    </dd>
                  </Fragment>
                ))}
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProgramMainList;
