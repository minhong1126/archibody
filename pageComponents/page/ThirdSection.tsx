const programData = [
  {
    index: '01',
    title: '몸건축 워크샵',
    content:
      '예비 건축주 또는 건축에 관심 있는 고객을 대상으로 집을 돌아봅니다.',
  },
  {
    index: '02',
    title: '신규 오픈하우스',
    content:
      '고성능 주택(SIP, 목조, 고단열)을 직접 체험하고 싶은 고객을 대상으로 최신 프로젝트를 돌아봅니다.',
  },
  {
    index: '03',
    title: '찾아가는 건축상담',
    content:
      '집 짓기를 계획하고 계신 분, 건축에 관심있는 고객을 대상으로 방문 상담을 진행합니다.',
  },
];

const ThirdSection = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-8 px-[5%] py-10 lg:size-full lg:gap-12 lg:pt-20">
      <h2 className="text-font-title text-[clamp(17px,2.5vw,40px)] font-semibold">
        건축주 참여 프로그램
      </h2>

      <div className="flex w-full flex-col gap-8 lg:w-auto lg:flex-row lg:gap-10">
        {programData.map((program) => (
          <div key={program.index} className="flex flex-1">
            <div
              className={[
                'flex w-full flex-col gap-4 rounded-[14px] bg-[#f1f1f1] px-5.75 py-6.5 break-keep lg:gap-5',
                'lg:rounded-[40px] lg:bg-linear-to-b lg:from-[#666666]/20 lg:to-white/20 lg:px-7 lg:py-10 lg:shadow-[0px_-2px_45.5px_rgba(0,0,0,0.05),inset_-7px_1px_19px_rgba(255,255,255,1)]',
              ].join(' ')}
            >
              <div className="flex gap-3 lg:flex-col lg:gap-8">
                <p className="text-[clamp(0.9375rem,3vw,1.5625rem)] font-bold text-[#828282] lg:text-[clamp(1.5625rem,1.927vw,2.3125rem)]">
                  {program.index}
                </p>
                <p className="text-[clamp(0.9375rem,3vw,1.5625rem)] font-semibold text-[#424242] lg:text-[clamp(1.5625rem,1.771vw,2.125rem)]">
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
