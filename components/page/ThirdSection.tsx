import getProgramMainList from '@/feature/page/getProgramMainList';

const shadow =
  'shadow-[0px_-2px_45.5px_rgba(0,0,0,0.05),inset_-7px_1px_19px_rgba(255,255,255,1)]';

const ThirdSection = () => {
  const programDescList = getProgramMainList();

  return (
    <section className="flex flex-col items-center justify-center gap-8 px-[5%] py-10 lg:size-full lg:gap-12 lg:pt-20">
      <h2 className="section-title">건축주 참여 프로그램</h2>

      <div className="flex w-full flex-col gap-8 lg:w-auto lg:flex-row lg:gap-10">
        {programDescList.map((program) => (
          <div key={program.index} className="flex flex-1">
            <div
              className={[
                'flex w-full flex-col gap-4 rounded-[14px] bg-[#f1f1f1] px-5.75 py-6.5 break-keep lg:gap-5',
                `lg:${shadow} lg:rounded-[40px] lg:bg-linear-to-b lg:from-[#666666]/20 lg:to-white/20 lg:px-7 lg:py-10`,
              ].join(' ')}
            >
              <div className="flex gap-3 lg:flex-col lg:gap-7">
                <p className="text-[clamp(0.9375rem,3vw,1.5625rem)] font-bold text-[#828282] lg:text-[clamp(1.5625rem,2vw,2.3125rem)]">
                  {program.index}
                </p>
                <p className="text-[clamp(0.9375rem,3vw,1.5625rem)] font-semibold text-[#424242] lg:text-[clamp(1.5625rem,1.7vw,2.125rem)]">
                  {program.title}
                </p>
              </div>
              <p className="text-[clamp(0.625rem,2vw,0.8125rem)] font-medium text-[#777777] lg:text-[clamp(0.8125rem,1.4vw,1.4375rem)]">
                {program.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThirdSection;
