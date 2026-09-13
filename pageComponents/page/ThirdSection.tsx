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

const ProgramBlock = ({
  index,
  title,
  content,
}: {
  index: string;
  title: string;
  content: string;
}) => {
  return (
    <div
      className={[
        'flex w-full flex-col rounded-[14px] bg-[#f1f1f1] px-5.75 py-5.5 min-[1400px]:justify-center min-[1400px]:rounded-[40px]',
        'min-[1400px]:bg-linear-to-b min-[1400px]:from-[#666666]/20 min-[1400px]:to-white/20 min-[1400px]:px-14 min-[1400px]:py-20 min-[1400px]:shadow-[0px_-2px_45.5px_rgba(0,0,0,0.05),inset_-7px_1px_19px_rgba(255,255,255,1)]',
      ].join(' ')}
    >
      <div className="mb-5.25 flex gap-3 min-[1400px]:mb-6.75 min-[1400px]:flex-col min-[1400px]:gap-8">
        <p className="text-[clamp(15px,3.5vw,25px)] font-bold text-[#828282] min-[1400px]:text-[37px]">
          {index}
        </p>
        <p className="text-[clamp(15px,3.5vw,25px)] font-semibold text-[#424242] min-[1400px]:text-[34px]">
          {title}
        </p>
      </div>
      <p className="text-[clamp(10px,2.8vw,13px)] font-medium text-[#777777] min-[1400px]:text-2xl">
        {content}
      </p>
    </div>
  );
};

const ThirdSection = () => {
  return (
    <section className="flex flex-col items-center justify-center px-[5%] py-10 min-[1400px]:size-full min-[1400px]:py-54">
      <h2 className="mb-8 text-[clamp(17px,3.5vw,35px)] font-semibold text-[#2D2D2D] min-[1400px]:mb-12 min-[1400px]:text-[40px]">
        건축주 참여 프로그램
      </h2>

      <div className="flex w-full flex-col gap-8 min-[1400px]:w-auto min-[1400px]:flex-row min-[1400px]:gap-10 min-[1400px]:px-40">
        {programData.map((program) => (
          <ProgramBlock key={program.index} {...program} />
        ))}
      </div>
    </section>
  );
};

export default ThirdSection;
