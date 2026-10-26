const FirstSection = () => {
  return (
    <section className="flex aspect-390/218 flex-col items-center justify-center gap-[clamp(10px,3vw,40px)] lg:size-full lg:gap-6">
      <h1 className="text-font-title text-center text-[clamp(21px,4vw,40px)] font-semibold lg:text-[50px]">
        내 몸에 맞는 집
      </h1>

      <h6 className="text-center text-[clamp(14px,2.8vw,31px)] font-medium">
        <span className="text-[#787878]">건강</span>
        <span className="text-[#9e9e9e]">하고 </span>
        <span className="text-[#787878]">아름다운 집</span>
        <span className="text-[#9e9e9e]">을 디자인합니다.</span>
      </h6>
    </section>
  );
};

export default FirstSection;
