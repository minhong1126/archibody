import Image from 'next/image';

const SecondSection = () => {
  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-[clamp(1.5rem,6vw,4rem)] overflow-hidden py-[clamp(3rem,8vw,7rem)]">
      <div className="w-full px-0 lg:px-[10%]">
        <Image
          src="/about/about-image.png"
          alt="about"
          width={1920}
          height={1080}
          className="h-auto w-full"
        />
      </div>

      <p className="max-w-[clamp(18rem,60vw,56.25rem)] text-center text-[clamp(10px,1.5vw,24px)] leading-[clamp(1rem,2.5vw,2.5rem)] font-normal break-keep text-neutral-500">
        <span className="font-semibold">집 짓기</span>는 터를 고르고 알맞은
        크기와 형태의 집을
        <br className="lg:hidden" /> 알맞은 자리에 놓고 필요한 것들로 채워
        나가는 것.
        <br />
        <br className="lg:hidden" />
        <span className="font-semibold text-neutral-600">
          내 집을 짓고 살아간다
        </span>
        는 의미는
        <br className="lg:hidden" /> 우리의 삶을
        <span className="font-semibold">우리 모양대로</span> 만들어가는 즐거운
        여정입니다.
        <br />
        <br className="lg:hidden" />
        집을 짓고자 하는 모든 분들께
        <br className="lg:hidden" /> 편안하고 반가운 길동무가 되고 싶습니다.
      </p>
    </section>
  );
};

export default SecondSection;
