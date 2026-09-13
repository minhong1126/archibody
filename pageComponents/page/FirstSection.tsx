const FirstSection = () => {
  return (
    <section className="flex aspect-390/218 flex-col items-center justify-center gap-5 lg:size-full lg:gap-6">
      <h1 className="text-font-main text-center text-[clamp(21px,4vw,40px)] font-semibold lg:text-[50px]">
        내 몸에 맞는 집
      </h1>

      <h6 className="text-center text-[clamp(14px,2.8vw,31px)] font-medium">
        <span className="text-font-desc-dark">건강</span>
        <span className="text-font-desc-light">하고 </span>
        <span className="text-font-desc-dark">아름다운 집</span>
        <span className="text-font-desc-light">을 디자인합니다.</span>
      </h6>
    </section>
  );
};

export default FirstSection;
