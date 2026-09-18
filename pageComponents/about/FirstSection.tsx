import { IoIosArrowRoundForward } from 'react-icons/io';

const FirstSection = () => {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-[clamp(1.5rem,5vw,4rem)] px-[calc(42/390*100%)] py-[5%] lg:size-full">
      <h2 className="text-font-title text-center text-[clamp(16px,2.5vw,40px)] font-semibold">
        몸
      </h2>

      <div className="@container flex w-full max-w-160 items-center justify-center">
        <div className="relative aspect-square w-full max-w-2xs min-w-18 flex-1 rounded-full bg-linear-to-b from-[#666666]/5 to-white/5 shadow-[0px_16px_28.5px_0px_rgba(0,0,0,0.05),inset_-5px_1px_19px_0px_rgba(255,255,255,1.00)]">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <span className="text-center text-[clamp(0.8rem,5cqw,2rem)] font-semibold text-[#5C5C5C]">
              건강한 삶
            </span>
            <span className="text-[clamp(0.65rem,3.5cqw,1.5rem)] font-medium text-[#BDBDBD]">
              Software
            </span>
          </div>
        </div>

        <div className="flex flex-[0.5] items-center justify-center">
          <IoIosArrowRoundForward className="size-[clamp(1.25rem,6cqw,3rem)] shrink-0 text-[#CFCFCF]" />
        </div>

        <div
          className={[
            'relative aspect-square w-full max-w-2xs min-w-18 flex-1 rounded-full',
            'bg-linear-to-b from-[#666666]/5 to-white/5 shadow-[0px_16px_28.5px_0px_rgba(0,0,0,0.05),inset_-5px_1px_19px_0px_rgba(255,255,255,1.00)]',
          ].join(' ')}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-2">
            <span className="text-center text-[clamp(0.8rem,5cqw,2rem)] font-semibold text-[#5C5C5C]">
              건강한 몸
            </span>
            <span className="text-[clamp(0.65rem,3.5cqw,1.5rem)] font-medium text-[#BDBDBD]">
              Hardware
            </span>
          </div>
        </div>
      </div>

      <p className="max-w-[clamp(18rem,60vw,56.25rem)] text-center text-[clamp(0.75rem,1.4vw,1.25rem)] leading-[clamp(1.125rem,2vw,1.875rem)] font-normal text-[#707070]">
        <span className="font-semibold">몸</span>은
        <span className="font-semibold"> 건강한 삶</span>을 위한 바탕으로서
        <span className="font-semibold">건강한 집</span>을 의미합니다.
        <br />
        그래서 <span className="font-semibold">건축사사무소 몸</span>이 생각하는
        <span className="font-semibold">좋은 집</span>은
        <br className="lg:hidden" /> 따뜻하고 건강하고 아름다운 집,
        <br />
        <br className="lg:hidden" />
        <span className="font-semibold text-neutral-700">내 몸에 맞는 집</span>
        입니다.
      </p>
    </section>
  );
};

export default FirstSection;
