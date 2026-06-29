const programData = [
  {
    index: "01",
    title: "몸건축 워크샵",
    content:
      "예비 건축주 또는 건축에 관심 있는 고객을 대상으로 집을 돌아봅니다.",
  },
  {
    index: "02",
    title: "신규 오픈하우스",
    content:
      "고성능 주택(SIP, 목조, 고단열)을 직접 체험하고 싶은 고객을 대상으로 최신 프로젝트를 돌아봅니다.",
  },
  {
    index: "03",
    title: "찾아가는 건축상담",
    content:
      "집 짓기를 계획하고 계신 분, 건축에 관심있는 고객을 대상으로 방문 상담을 진행합니다.",
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
      className="flex flex-col flex-1 rounded-[20px] px-8 pt-10 pb-15 whitespace-pre-wrap"
      style={{
        background:
          "linear-gradient(180deg, rgba(102, 102, 102, 0.2) 0%, rgba(255, 255, 255, 0.2) 100%)",
        boxShadow:
          "0px 16px 28.5px rgba(0, 0, 0, 0.05), inset -5px 1px 19px #FFFFFF",
      }}
    >
      <p className="text-xl font-bold text-[#666666]">{index}</p>
      <p className="mt-5 text-lg font-semibold text-[#424242]">{title}</p>
      <p className="mt-2 text-sm whitespace-pre-line text-[#777777]">
        {content}
      </p>
    </div>
  );
};

const ThirdSection = () => {
  return (
    <section className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center py-20">
      <h2 className="mb-12 text-xl font-semibold">건축주 참여 프로그램</h2>

      <div className="flex gap-10 px-40">
        {programData.map((program) => (
          <ProgramBlock key={program.index} {...program} />
        ))}
      </div>
    </section>
  );
};

export default ThirdSection;
