import Image from 'next/image';
import getCareerHistoryList from '@/feature/about/getCareerHistoryList';
import aboutOwner from '@/public/about/about-owner.png';

const ThirdSection = () => {
  const careerHistoryList = getCareerHistoryList();

  return (
    <section className="flex w-full flex-col gap-[clamp(1.5rem,5vw,3rem)] pt-[clamp(2.5rem,6vw,5rem)] lg:px-[clamp(1.25rem,5vw,3rem)]">
      <div className="text-font-title flex flex-col items-center gap-[clamp(0.25rem,1vw,0.5rem)] text-center font-semibold">
        <span className="text-[clamp(0.75rem,1.4vw,1.5rem)]">대표</span>
        <span className="text-[clamp(17px,2vw,30px)]">건축사 임보라</span>
      </div>

      <div className="flex w-full items-center gap-[clamp(1.5rem,4vw,2.5rem)]">
        <Image
          src={aboutOwner}
          alt="건축사 임보라"
          className="hidden object-cover lg:flex"
          // className="size-100"
          // className="h-auto w-[clamp(200px,20vw,350px)] object-cover"
          // priority
        />

        <div className="flex flex-col items-start px-[10%] lg:px-0">
          {careerHistoryList.map((item, index) => (
            <div key={item.year} className="flex gap-2">
              <div className="flex flex-col items-center">
                <div className="flex h-[clamp(1.125rem,2vw,1.875rem)] items-center">
                  <div
                    className={`size-[clamp(0.5rem,0.8vw,0.75rem)] shrink-0 rounded-full bg-[${item.dot}]`}
                  />
                </div>
              </div>

              <div
                className={`flex flex-col items-start gap-2 pb-[clamp(1rem,1vw,2rem)]`}
              >
                <p
                  className={`text-[clamp(0.75rem,1.4vw,1.25rem)] leading-[clamp(1.125rem,2vw,1.875rem)] font-semibold ${
                    index === 0 ? 'text-[#525252]' : 'text-[#6E6E6E]'
                  }`}
                >
                  {item.year}
                </p>

                <p
                  className={`text-[clamp(0.75rem,1.4vw,1.25rem)] font-medium ${
                    index === 0 ? 'text-[#3F3F3F]' : 'text-[#6C6C6C]'
                  }`}
                >
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThirdSection;
